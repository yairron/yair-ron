#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
מייצר טופס PDF עם שדות מילוי לטופס פניה לייעוץ — בל/4300
הרץ פעם אחת:
    python BTL/support_files/senior_rights/scripts/generate_counseling_form_pdf.py

פלט: BTL/senior_rights/counseling_referral_form_fillable.pdf
"""

import os
import sys

# תמיכה ב-UTF-8 בפלט הטרמינל (Windows)
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# ── בדיקת תלויות ──────────────────────────────────────────────────
MISSING = []
try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.lib import colors
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
except ImportError:
    MISSING.append('reportlab')

try:
    from bidi.algorithm import get_display
    _bidi_ok = True
except ImportError:
    _bidi_ok = False
    MISSING.append('python-bidi')

try:
    import pdfrw as _pdfrw
    _pdfrw_ok = True
except ImportError:
    _pdfrw_ok = False
    MISSING.append('pdfrw')

if MISSING:
    print(f"\nERROR: חסרות חבילות Python: {', '.join(MISSING)}")
    print(f"התקן עם:  pip install {' '.join(MISSING)}\n")
    sys.exit(1)


# ── עזרי טקסט ─────────────────────────────────────────────────────
def H(t):
    """ממיר טקסט עברי לסדר ויזואלי RTL עבור reportlab"""
    return get_display(t) if _bidi_ok else t


# ── פונט ──────────────────────────────────────────────────────────
FONT, FONT_B = 'Helvetica', 'Helvetica-Bold'
_font_candidates = [
    ('C:/Windows/Fonts/arial.ttf',    'C:/Windows/Fonts/arialbd.ttf'),
    ('C:/Windows/Fonts/tahoma.ttf',   'C:/Windows/Fonts/tahomabd.ttf'),
]
for _rp, _bp in _font_candidates:
    if os.path.exists(_rp) and os.path.exists(_bp):
        try:
            pdfmetrics.registerFont(TTFont('HE',  _rp))
            pdfmetrics.registerFont(TTFont('HEB', _bp))
            FONT, FONT_B = 'HE', 'HEB'
        except Exception:
            pass
        break


# ── קבועי עיצוב ───────────────────────────────────────────────────
PW, PH = A4          # 595.27 × 841.89 pt
ML, MR  = 14, 14     # שוליים שמאל/ימין (mm)
MT      = 8          # שוליים עליון (mm)
RW      = 210 - ML - MR  # רוחב שמיש = 182mm

C_FILL    = colors.Color(.94, .96, 1.0)
C_BORDER  = colors.Color(.50, .50, .50)
C_SEC     = colors.Color(.75, .75, .75)
C_LBL     = colors.Color(.88, .88, .88)
C_LINE    = colors.Color(.40, .40, .40)
C_WHITE   = colors.white
C_BLACK   = colors.black


def p(v):
    return v * mm

def T(y_mm, h_mm=0):
    """ממיר Y מהחלק העליון של הדף לקואורדינטת reportlab (מהתחתית)"""
    return PH - p(y_mm) - p(h_mm)


# ══════════════════════════════════════════════════════════════════
class FB:
    """Form Builder — עוטף את canvas של reportlab"""

    def __init__(self, cv):
        self.cv = cv
        self.digit_groups = []  # [(prefix, count)] — לשימוש post-processing JS

    # ── צורות ─────────────────────────────────────────────────────
    def box(self, x, y, w, h, fill=None, lw=0.4):
        self.cv.setStrokeColor(C_LINE)
        self.cv.setLineWidth(lw)
        if fill:
            self.cv.setFillColor(fill)
            self.cv.rect(p(x), T(y+h), p(w), p(h), fill=1, stroke=1)
            self.cv.setFillColor(C_BLACK)
        else:
            self.cv.rect(p(x), T(y+h), p(w), p(h), fill=0, stroke=1)

    def line(self, x1, y1, x2, y2, lw=0.4, col=C_LINE):
        self.cv.setStrokeColor(col)
        self.cv.setLineWidth(lw)
        self.cv.line(p(x1), T(y1), p(x2), T(y2))

    # ── כותרות מקטע ───────────────────────────────────────────────
    def sec(self, y, title, h=5.5):
        self.box(ML, y, RW, h, fill=C_SEC)
        self.cv.setFont(FONT_B, 9)
        self.cv.setFillColor(C_BLACK)
        self.cv.drawRightString(p(210-MR-1.5), T(y+h)+p(1.8), H(title))
        return y + h

    def lbl(self, x, y, w, h, text, sz=7.5, bold=False):
        """תא תווית (רקע אפור)"""
        self.box(x, y, w, h, fill=C_LBL)
        self.cv.setFont(FONT_B if bold else FONT, sz)
        self.cv.setFillColor(C_BLACK)
        self.cv.drawRightString(p(x+w-1), T(y+h)+p(1.5), H(text))

    def txt(self, x, y, text, sz=8, bold=False):
        self.cv.setFont(FONT_B if bold else FONT, sz)
        self.cv.setFillColor(C_BLACK)
        self.cv.drawRightString(p(x), T(y), H(text))

    # ── שדות אינטראקטיביים ────────────────────────────────────────
    def tf(self, name, x, y, w, h=6.5, ml=50, multi=False, tip=''):
        """שדה טקסט"""
        flags = 'multiline' if multi else ''
        self.cv.acroForm.textfield(
            name=name, x=p(x), y=T(y+h), width=p(w), height=p(h),
            maxlen=ml, fontName='Helvetica', fontSize=9,
            fillColor=C_FILL, borderColor=C_BORDER, textColor=C_BLACK,
            forceBorder=True, fieldFlags=flags,
            tooltip=H(tip) if tip else '',
        )

    def digits(self, name, xr, y, n, bw=4.8, bh=6.5, seps=[], sc=C_LINE):
        """
        n תיבות ספרה בודדות.
        xr   = קצה ימני (mm)
        seps = רשימת אינדקסים (מימין, מ-0) שלשמאלם תצויר קו הפרדה
        שדות נוצרים LTR (name_0=שמאלי, name_{n-1}=ימני) לסדר Tab נכון.
        """
        self.digit_groups.append((name, n))
        for j in range(n):          # j=0 → שמאלי ביותר → name_0
            i = n - 1 - j           # i=מיקום מימין (0=ימני)
            bx = xr - (i + 1) * bw
            self.cv.acroForm.textfield(
                name=f'{name}_{j}',
                x=p(bx), y=T(y+bh), width=p(bw), height=p(bh),
                maxlen=1, fontName='Helvetica', fontSize=10,
                fillColor=C_FILL, borderColor=C_BORDER, textColor=C_BLACK,
                forceBorder=True,
            )
            if i in seps:
                self.cv.setStrokeColor(sc)
                self.cv.setLineWidth(1.2)
                self.cv.line(p(bx), T(y), p(bx), T(y+bh))
                self.cv.setStrokeColor(C_LINE)
                self.cv.setLineWidth(0.4)

    def cb(self, name, x, y, label='', lx=None, sz=7.5, csz=4.0):
        """תיבת סימון + תווית"""
        self.cv.acroForm.checkbox(
            name=name, x=p(x), y=T(y+csz), size=p(csz),
            checked=False, buttonStyle='check',
            borderColor=C_BORDER, fillColor=C_WHITE, forceBorder=True,
        )
        if label:
            self.cv.setFont(FONT, sz)
            self.cv.setFillColor(C_BLACK)
            lx_ = lx if lx is not None else x - 0.5
            self.cv.drawRightString(p(lx_), T(y+csz)+p(0.5), H(label))


# ══════════════════════════════════════════════════════════════════
#  עמוד 1
# ══════════════════════════════════════════════════════════════════
def page1(cv, fb):
    RX = 210 - MR  # קצה ימני (mm)
    RH = 7.5       # גובה שורה רגיל (mm)
    SH = 5.5       # גובה כותרת מקטע (mm)
    BW = 4.5       # רוחב תיבת ספרה (mm)
    BH = 6.5       # גובה תיבת ספרה (mm)

    # ── מסגרת חיצונית ─────────────────────────────────────────────
    fb.box(ML, MT, RW, 281, lw=0.8)

    # ── כותרת ─────────────────────────────────────────────────────
    fb.box(ML, MT, RW, 24, fill=C_WHITE, lw=0.4)

    # לוגו (עיגול פשוט)
    cv.setFillColor(C_BLACK)
    cx_logo = p(ML + 10)
    cy_logo = T(MT + 12)
    cv.circle(cx_logo, cy_logo, p(9), fill=1, stroke=0)
    cv.setFillColor(C_WHITE)
    cv.setFont(FONT_B, 6.5)
    cv.drawCentredString(cx_logo, cy_logo + p(2),   H('ביטוח'))
    cv.drawCentredString(cx_logo, cy_logo - p(2.5), H('לאומי'))
    cv.setFillColor(C_BLACK)

    # כותרת מרכזית
    cv.setFont(FONT_B, 13)
    cv.drawCentredString(p(210/2), T(MT+9), H('פניה לייעוץ'))
    cv.setFont(FONT, 8)
    cv.drawCentredString(p(210/2), T(MT+14), H('המוסד לביטוח לאומי — מינהל הגמלאות'))
    cv.drawCentredString(p(210/2), T(MT+19), H('אגף הייעוץ לאזרח הוותיק ומשפחתו'))

    # מסגרת שימוש פנימי (שמאל עליון)
    IW, IH = 33, 24
    fb.box(ML, MT, IW, IH, fill=colors.Color(.93,.93,.93))
    fb.txt(ML + IW - 1, MT + 5, 'לשימוש פנימי בלבד', sz=7, bold=True)

    # scan_id — 9 תיבות ספרה קטנות
    fb.txt(ML + IW - 1, MT + 10, "מס' זהות:", sz=7)
    fb.digits('scan_id', ML + IW - 1, MT + 11, 9, bw=3.2, bh=4.8, seps=[0])

    # דפים + סוג
    fb.txt(ML + IW - 1, MT + 18, 'דפים:', sz=7)
    fb.digits('scan_pages', ML + IW - 1, MT + 19, 2, bw=3.5, bh=4.8)
    fb.txt(ML + IW - 8.5, MT + 18, 'סוג:', sz=7)
    fb.digits('scan_doc', ML + IW - 8.5, MT + 19, 2, bw=3.5, bh=4.8)

    y = MT + 24  # Y נוכחי מתחת לכותרת

    # ══ פרטי היועץ ════════════════════════════════════════════════
    y = fb.sec(y, 'פרטי היועץ', SH)

    # תאריך | שם משפחה | שם פרטי | מס' זהות
    fb.lbl(ML, y, 17, RH, 'תאריך')
    # תאריך: DD / MM / YYYY — 8 תיבות, הפרדה אחרי DD ואחרי MM
    # seps ב-i=5 (אחרי יום) ו-i=3 (אחרי חודש) — ספירה מימין
    DX = ML + 17 + 8*3.8 + 1
    fb.digits('counselor_date', DX, y+0.5, 8, bw=3.8, bh=BH-0.5, seps=[5, 3], sc=C_LINE)
    # סימני /
    cv.setFont(FONT, 8)
    cv.setFillColor(C_BLACK)
    cv.drawString(p(DX - 3*3.8 - 0.5),  T(y+RH)+p(2), '/')
    cv.drawString(p(DX - 5*3.8 - 0.5),  T(y+RH)+p(2), '/')

    NX = ML + 17 + 8*3.8 + 2 + 2  # אחרי תיבות התאריך
    fb.lbl(NX, y, 18, RH, "שם משפחה")
    fb.tf('counselor_lastname', NX+18, y+0.5, 28, RH-1, ml=30)

    FX = NX + 18 + 28 + 1
    fb.lbl(FX, y, 15, RH, "שם פרטי")
    fb.tf('counselor_firstname', FX+15, y+0.5, 22, RH-1, ml=30)

    IDX = FX + 15 + 22 + 2
    fb.lbl(IDX, y, 14, RH, "מס' זהות")
    fb.digits('counselor_id', RX-1, y+0.5, 9, bw=BW, bh=BH, seps=[0])

    y += RH

    # ══ מקבל הייעוץ — אזרח ותיק ══════════════════════════════════
    y = fb.sec(y, 'מקבל הייעוץ — אזרח ותיק', SH)

    # שורה 1: ת"ז + שם משפחה + שם פרטי
    fb.lbl(ML, y, 14, RH, "מס' זהות")
    fb.digits('client_id', ML+14+9*BW+1, y+0.5, 9, bw=BW, bh=BH, seps=[0])

    S2 = ML + 14 + 9*BW + 2
    fb.lbl(S2, y, 18, RH, "שם משפחה")
    fb.tf('client_lastname', S2+18, y+0.5, 38, RH-1, ml=30)

    S3 = S2 + 18 + 38 + 1
    fb.lbl(S3, y, 15, RH, "שם פרטי")
    fb.tf('client_firstname', S3+15, y+0.5, RX-S3-15-1, RH-1, ml=30)
    y += RH

    # שורה 2: כתובת
    fb.lbl(ML, y, 14, RH, "רחוב/ת.ד.")
    fb.tf('client_street', ML+14, y+0.5, 50, RH-1, ml=40)

    A2 = ML + 14 + 50 + 1
    fb.lbl(A2, y, 14, RH, "מס' בית")
    fb.tf('client_house', A2+14, y+0.5, 12, RH-1, ml=6)

    A3 = A2 + 14 + 12 + 1
    fb.lbl(A3, y, 11, RH, "כניסה")
    fb.tf('client_entrance', A3+11, y+0.5, 10, RH-1, ml=4)

    A4 = A3 + 11 + 10 + 1
    fb.lbl(A4, y, 11, RH, "דירה")
    fb.tf('client_apt', A4+11, y+0.5, RX-A4-11-1, RH-1, ml=6)
    y += RH

    # שורה 3: יישוב + מיקוד + מצב משפחתי
    fb.lbl(ML, y, 12, RH, "יישוב")
    fb.tf('client_city', ML+12, y+0.5, 50, RH-1, ml=30)

    C2 = ML + 12 + 50 + 1
    fb.lbl(C2, y, 12, RH, "מיקוד")
    fb.tf('client_zip', C2+12, y+0.5, 22, RH-1, ml=7)

    C3 = C2 + 12 + 22 + 1
    fb.lbl(C3, y, 18, RH, "מצב משפחתי")
    fb.tf('client_family_status', C3+18, y+0.5, RX-C3-18-1, RH-1, ml=20)
    y += RH

    # שורה 4: טלפונים
    fb.lbl(ML, y, 18, RH, "טלפון קווי")
    # 9 ספרות, הפרדה אחרי 2 מימין = seps=[6]
    fb.digits('phone_land', ML+18+9*BW+1, y+0.5, 9, bw=BW, bh=BH, seps=[6], sc=C_BLACK)

    PH2 = ML + 18 + 9*BW + 3
    fb.lbl(PH2, y, 18, RH, "טלפון נייד")
    # 10 ספרות, הפרדה אחרי 3 מימין = seps=[6]
    fb.digits('phone_mobile', PH2+18+10*BW+1, y+0.5, 10, bw=BW, bh=BH, seps=[6], sc=C_BLACK)
    y += RH

    # ══ מקבל הייעוץ — אחר ════════════════════════════════════════
    y = fb.sec(y, 'מקבל הייעוץ — אחר', SH)

    fb.lbl(ML, y, 16, RH, "שם משפחה")
    fb.tf('other_lastname', ML+16, y+0.5, 33, RH-1, ml=30)

    O2 = ML + 16 + 33 + 1
    fb.lbl(O2, y, 14, RH, "שם פרטי")
    fb.tf('other_firstname', O2+14, y+0.5, 30, RH-1, ml=30)

    O3 = O2 + 14 + 30 + 1
    fb.lbl(O3, y, 14, RH, "טלפון")
    fb.tf('other_phone', O3+14, y+0.5, 22, RH-1, ml=15)

    O4 = O3 + 14 + 22 + 1
    fb.lbl(O4, y, 14, RH, "קרבה")
    fb.tf('other_relation', O4+14, y+0.5, RX-O4-14-1, RH-1, ml=20)
    y += RH

    # ══ סיבת הפניה — אוכלוסיית יעד ══════════════════════════════
    y = fb.sec(y, 'סיבת הפניה (אוכלוסיית יעד)', SH)

    # כותרות עמודות
    COL = RW / 4
    col_titles = ['אזרח ותיק', 'סיעוד', 'גיל', 'אחר']
    for i, t in enumerate(col_titles):
        fb.lbl(ML + i*COL, y, COL - 0.3, 5.5, t, bold=True)
    y += 5.5

    COL_ITEMS = [
        [  # אזרח ותיק
            ('cb_tova1',     'מגיש תביעה לקצבת אזרח ותיק'),
            ('cb_tova2',     'מקבל קצבת אזרח ותיק'),
            ('cb_hachnasat', 'מקבל השלמת הכנסה'),
            ('cb_tova3',     'מקבל קצבה אחרת'),
        ],
        [  # סיעוד
            ('cb_siyud1', 'מגיש תביעה לגמלת סיעוד'),
            ('cb_siyud2', 'מקבל גמלת סיעוד'),
            ('cb_siyud3', 'בקרת סיעוד'),
            ('cb_siyud4', 'תביעת סיעוד נדחתה'),
        ],
        [  # גיל
            ('cb_90plus', 'בני 90 פלוס'),
            ('cb_100',    'בני מאה'),
        ],
        [  # אחר
            ('cb_alman',      'אלמן/ה'),
            ('cb_shoah',      'ניצול שואה'),
            ('cb_nehe',       'נכה כללי'),
            ('cb_agaf_yiuts', 'פניה לשירות הייעוץ'),
            ('cb_russia',     'אמנת רוסיה'),
        ],
    ]

    CB_SZ  = 3.8
    CB_ROW = 6.0
    max_rows = max(len(c) for c in COL_ITEMS)

    for r in range(max_rows):
        for ci, col in enumerate(COL_ITEMS):
            if r < len(col):
                nm, lbl_txt = col[r]
                # קצה ימני של העמודה
                col_right = ML + (ci+1)*COL - 1
                cb_x = col_right - CB_SZ - 1
                fb.cb(nm, cb_x, y+0.8, lbl_txt, lx=cb_x-0.5, sz=7.5, csz=CB_SZ)
        y += CB_ROW

    # ══ פניה ע"י פקיד תביעות ══════════════════════════════════════
    y = fb.sec(y, 'פניה ע"י פקיד תביעות בסניף', SH)

    fb.cb('cb_pakid', RX-CB_SZ-1, y+0.8, 'פניה ע"י פקיד תביעות', lx=RX-CB_SZ-2, sz=8, csz=CB_SZ)
    y += CB_ROW

    officer_types = [
        ('cb_pakid_azrach',  'אגף אזרח ותיק'),
        ('cb_pakid_siyud',   'סיעוד'),
        ('cb_pakid_dalpak',  'דלפק קדמי'),
        ('cb_pakid_givia',   'גבייה'),
        ('cb_pakid_acher',   'אחר'),
    ]
    ox = RX
    for nm, lbl_txt in officer_types:
        w_est = len(lbl_txt) * 2.1 + CB_SZ + 2.5
        ox -= w_est
        fb.cb(nm, ox + w_est - CB_SZ - 0.5, y+0.8, lbl_txt,
              lx=ox + w_est - CB_SZ - 1.5, sz=7.5, csz=CB_SZ)
    y += CB_ROW

    # ══ גורם קהילתי ══════════════════════════════════════════════
    y = fb.sec(y, 'גורם קהילתי', SH)

    fb.cb('cb_kehila', RX-CB_SZ-1, y+0.8, 'הופנה ע"י גורם קהילתי',
          lx=RX-CB_SZ-2, sz=8, csz=CB_SZ)

    fb.lbl(ML, y, 18, RH, "שם הגורם")
    fb.tf('kehila_name', ML+18, y+0.5, 50, RH-1, ml=30)

    K2 = ML + 18 + 50 + 1
    fb.lbl(K2, y, 12, RH, "טלפון")
    fb.tf('kehila_phone', K2+12, y+0.5, 28, RH-1, ml=15)
    y += RH

    # ══ פרויקט מוסדי ════════════════════════════════════════════
    y = fb.sec(y, 'פרויקט מוסדי', SH)

    fb.cb('cb_project', RX-CB_SZ-1, y+0.8, 'נכלל בפרויקט מוסדי',
          lx=RX-CB_SZ-2, sz=8, csz=CB_SZ)

    fb.lbl(ML, y, 12, RH, "פרט")
    fb.tf('project_detail', ML+12, y+0.5, 90, RH-1, ml=60)
    y += RH

    # ══ גיל הפונה ════════════════════════════════════════════════
    fb.lbl(ML, y, 22, RH, "גיל הפונה")
    fb.tf('client_age', ML+22, y+0.5, 18, RH-1, ml=3, tip='גיל')


# ══════════════════════════════════════════════════════════════════
#  עמוד 2
# ══════════════════════════════════════════════════════════════════
def page2(cv, fb):
    RX    = 210 - MR
    SH    = 5.5
    CB_SZ = 3.8
    CB_ROW = 6.0

    # מסגרת חיצונית
    fb.box(ML, MT, RW, 281, lw=0.8)

    # כותרת עמוד
    cv.setFont(FONT_B, 10)
    cv.setFillColor(C_BLACK)
    cv.drawCentredString(p(210/2), T(MT+7), H('טופס פניה לייעוץ  —  בל/4300   |   עמוד 2'))

    y = MT + 14

    # ══ אופן הפניה ════════════════════════════════════════════════
    y = fb.sec(y, 'אופן הפניה', SH)

    ref_methods = [
        ('cb_arrived_self', 'הגיע בעצמו'),
        ('cb_phone_call',   'שיחת טלפון'),
        ('cb_phone_9696',   'מרכז מידע טלפוני *9696'),
        ('cb_phone_dept',   'טלפון במחלקה'),
        ('cb_email_ref',    'דואר אלקטרוני'),
    ]
    ox = RX
    for nm, lbl_txt in ref_methods:
        w_est = len(lbl_txt) * 2.05 + CB_SZ + 3
        ox -= w_est
        fb.cb(nm, ox + w_est - CB_SZ - 0.5, y+0.8, lbl_txt,
              lx=ox + w_est - CB_SZ - 1.5, sz=7.5, csz=CB_SZ)
    y += CB_ROW

    # ══ פניה ביוזמת ═══════════════════════════════════════════════
    y = fb.sec(y, 'פניה ביוזמת', SH)

    init_items = [
        ('cb_init_client',    'מקבל הייעוץ'),
        ('cb_init_counselor', 'היועץ'),
    ]
    ox = RX
    for nm, lbl_txt in init_items:
        w_est = len(lbl_txt) * 2.2 + CB_SZ + 3
        ox -= w_est
        fb.cb(nm, ox + w_est - CB_SZ - 0.5, y+0.8, lbl_txt,
              lx=ox + w_est - CB_SZ - 1.5, sz=8, csz=CB_SZ)
    y += CB_ROW

    # ══ נושאים שעלו בפנייה ════════════════════════════════════════
    y = fb.sec(y, 'נושאים שעלו בפנייה (ניתן לסמן יותר מנושא אחד)', SH)

    topics = [
        ('cb_n_kitzba',  'קצבת אזרח ותיק'),
        ('cb_n_shairim', 'שאירים'),
        ('cb_n_hachnasa','השלמת הכנסה'),
        ('cb_n_siyud',   'סיעוד'),
        ('cb_n_iva',     'איבה'),
        ('cb_n_asir',    'אסירי ציון'),
        ('cb_n_nechut',  'נכות מעבודה'),
        ('cb_n_shram',   'שר"מ'),
        ('cb_n_nayad',   'ניידות'),
        ('cb_n_givia',   'גבייה'),
        ('cb_n_yiuts',   'שירותי הייעוץ'),
        ('cb_n_zchuyot', 'זכויות בקהילה'),
        ('cb_n_acher',   'אחר'),
    ]
    # 2 שורות
    PER_ROW = 7
    for row_i in range(2):
        ox = RX
        row_items = topics[row_i*PER_ROW:(row_i+1)*PER_ROW]
        for nm, lbl_txt in row_items:
            w_est = len(lbl_txt) * 2.0 + CB_SZ + 2.5
            ox -= w_est
            fb.cb(nm, ox + w_est - CB_SZ - 0.5, y+0.8, lbl_txt,
                  lx=ox + w_est - CB_SZ - 1.5, sz=7.5, csz=CB_SZ)
        y += CB_ROW

    # ══ אופן הסיוע ════════════════════════════════════════════════
    y = fb.sec(y, 'אופן הסיוע (ניתן לסמן יותר מאפשרות אחת)', SH)

    assist = [
        ('cb_s_forms',     'סיוע במילוי טפסים'),
        ('cb_s_translate', 'תרגום'),
        ('cb_s_explain',   'הסברה'),
        ('cb_s_pakid',     'בירור אצל פקיד תביעות'),
        ('cb_s_community', 'הפניה לשירותים אחרים'),
        ('cb_s_letter',    'כתיבת מכתב'),
        ('cb_s_support',   'שיחת תמיכה'),
        ('cb_s_send',      'שליחת אישורים וטפסים'),
    ]
    for row_i in range(2):
        ox = RX
        row_items = assist[row_i*4:(row_i+1)*4]
        for nm, lbl_txt in row_items:
            w_est = len(lbl_txt) * 2.0 + CB_SZ + 2.5
            ox -= w_est
            fb.cb(nm, ox + w_est - CB_SZ - 0.5, y+0.8, lbl_txt,
                  lx=ox + w_est - CB_SZ - 1.5, sz=7.5, csz=CB_SZ)
        y += CB_ROW

    # ══ פירוט הפניה ════════════════════════════════════════════════
    y = fb.sec(y, 'פירוט הפניה', SH)
    TA_H = 40
    fb.tf('referral_detail', ML, y, RW, TA_H, ml=2000, multi=True)
    y += TA_H

    # ══ תשובות היועץ ═══════════════════════════════════════════════
    y = fb.sec(y, 'תשובות היועץ', SH)
    TA_H2 = 40
    fb.tf('counselor_answers', ML, y, RW, TA_H2, ml=2000, multi=True)


# ══════════════════════════════════════════════════════════════════
#  הוספת JavaScript לקידום אוטומטי בשדות ספרות
# ══════════════════════════════════════════════════════════════════
def _add_autoadvance_js(pdf_path, digit_groups):
    """מוסיף Keystroke-JS לכל תיבת ספרה: ספרה תקפה → קפיצה לתיבה הבאה (LTR)"""
    if not _pdfrw_ok:
        print("אזהרה: pdfrw לא מותקן — auto-advance לא נוסף. הרץ: pip install pdfrw")
        return

    # בניית קבוצת שמות כל שדות הספרות
    digit_names = set()
    for prefix, count in digit_groups:
        for i in range(count):
            digit_names.add(f'{prefix}_{i}')

    # JS ללא backslash — [0-9] במקום \d
    JS = (
        "if(event.willCommit)return;"
        "if(/^[0-9]$/.test(event.change)){"
        "event.rc=true;"
        "var n=event.target.name,i=n.lastIndexOf('_');"
        "var f=this.getField(n.substr(0,i+1)+(parseInt(n.substr(i+1))+1));"
        "if(f)f.setFocus();"
        "}else if(event.change!=''){event.rc=false;}"
    )

    reader = _pdfrw.PdfReader(pdf_path)
    for page in reader.pages:
        annots = page.Annots
        if not annots:
            continue
        for annot in annots:
            t = annot.T
            if not t:
                continue
            field_name = str(t).strip('()')
            if field_name in digit_names:
                annot.AA = _pdfrw.PdfDict(
                    K=_pdfrw.PdfDict(
                        S=_pdfrw.PdfName.JavaScript,
                        JS=JS,
                    )
                )

    _pdfrw.PdfWriter().write(pdf_path, reader)
    print("✓ JavaScript auto-advance נוסף לשדות הספרות")


# ══════════════════════════════════════════════════════════════════
#  Main
# ══════════════════════════════════════════════════════════════════
def generate(out_path):
    cv = canvas.Canvas(out_path, pagesize=A4)
    cv.setTitle(H('פניה לייעוץ — בל/4300'))
    cv.setAuthor(H('המוסד לביטוח לאומי'))

    fb = FB(cv)

    # עמוד 1
    page1(cv, fb)
    cv.showPage()

    # עמוד 2
    page2(cv, fb)
    cv.showPage()

    cv.save()

    # Post-processing: הוסף JS לקידום אוטומטי
    _add_autoadvance_js(out_path, fb.digit_groups)

    print(f"✓ נוצר בהצלחה:\n  {out_path}")


if __name__ == '__main__':
    _here        = os.path.dirname(os.path.abspath(__file__))
    _root        = os.path.abspath(os.path.join(_here, '..', '..', '..', '..'))
    _out         = os.path.join(_root, 'BTL', 'senior_rights',
                                'counseling_referral_form_fillable.pdf')
    generate(_out)
