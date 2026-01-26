/**
 * מנוע ניתוח שאלון אינטק - אזרח ותיק
 * מנתח תשובות ומזהה זכויות רלוונטיות לפי רמת סבירות
 */

class IntakeAnalyzer {
    constructor(answers) {
        this.answers = answers;
        // Derived fields from intro questions
        this.ageCategory = this.computeAgeCategory();
        this.residency = this.answers.q0_residency || this.answers.q2_residency;
        this.results = {
            high_probability: [],
            medium_probability: [],
            not_relevant: [],
            additional_info: []
        };
    }

    /**
     * Compute age category from numeric age and gender.
     * Categories: under_retirement | retirement_to_70 | above_70
     */
    computeAgeCategory() {
        const ageNum = parseInt(this.answers.q0_age, 10);
        const gender = this.answers.q0_gender; // 'male' | 'female'
        if (isNaN(ageNum)) {
            // fallback to previous categorical answer if present
            return this.answers.q1_age || 'under_retirement';
        }
        const retirementAge = gender === 'female' ? 62 : 67;
        if (ageNum < retirementAge) return 'under_retirement';
        if (ageNum <= 70) return 'retirement_to_70';
        return 'above_70';
    }

    /**
     * ניתוח מלא והפקת המלצות
     */
    analyze() {
        this.analyzeSeniorCitizenPension();
        this.analyzeIncomeSupplementGuarantee();
        this.analyzeNursingBenefit();
        this.analyzeDisabilityBenefit();
        this.analyzeSurvivors();
        this.analyzeSpecialServices();
        this.analyzeDependents();
        this.analyzeAdaptationBenefit();
        this.analyzeDisabledChild();
        this.analyzeKibbutzMember();
        this.analyzeVehicleImpact();
        
        return this.results;
    }

    /**
     * קצבת אזרח ותיק
     */
    analyzeSeniorCitizenPension() {
        const age = this.ageCategory;
        const residency = this.residency;
        const currentBenefits = this.answers.q17_current_benefits || [];

        if (residency === 'abroad') {
            this.results.not_relevant.push({
                benefit: 'קצבת אזרח ותיק',
                reason: 'שוהה בחו״ל מעל 6 חודשים בשנה'
            });
            return;
        }

        if (currentBenefits.includes('senior')) {
            this.results.additional_info.push({
                benefit: 'קצבת אזרח ותיק',
                note: 'כבר מקבל - בדוק תוספות אפשריות'
            });
            return;
        }

        if (age === 'retirement_to_70' || age === 'above_70') {
            this.results.high_probability.push({
                benefit: 'קצבת אזרח ותיק',
                reason: 'בגיל זכאות',
                action: 'יש להגיש תביעה בביטוח לאומי',
                urgency: 'גבוהה'
            });
        } else {
            this.results.not_relevant.push({
                benefit: 'קצבת אזרח ותיק',
                reason: 'מתחת לגיל פרישה'
            });
        }
    }

    /**
     * השלמת הכנסה / הבטחת הכנסה
     */
    analyzeIncomeSupplementGuarantee() {
        const age = this.ageCategory;
        const incomeLevel = this.answers.q7_income_level;
        const assets = this.answers.q8_assets || [];
        const vehicles = this.answers.q9b_vehicles;
        const kibbutz = this.answers.q9a_kibbutz;

        // חבר קיבוץ שיתופי - כללים שונים
        if (kibbutz === 'kibbutz_shitufi') {
            this.results.medium_probability.push({
                benefit: 'השלמת הכנסה - חבר קיבוץ שיתופי',
                reason: 'חישוב מיוחד לחברי קיבוץ',
                action: 'נדרשת בדיקה מעמיקה של הכנסות הקיבוץ',
                urgency: 'בינונית'
            });
            return;
        }

        // בדיקת נכסים שמונעים
        if (assets.includes('apartment') || vehicles === 'two' || vehicles === 'three_plus') {
            this.results.not_relevant.push({
                benefit: 'השלמת הכנסה',
                reason: 'יש נכסים מעל התקרה (דירה נוספת או רכבים מרובים)'
            });
            return;
        }

        if (incomeLevel === 'below_threshold') {
            if (age === 'retirement_to_70' || age === 'above_70') {
                this.results.high_probability.push({
                    benefit: 'השלמת הכנסה',
                    reason: 'הכנסה מתחת לתקרה + בגיל זכאות',
                    action: 'יש להגיש תביעה בביטוח לאומי',
                    urgency: 'גבוהה'
                });
            } else {
                this.results.medium_probability.push({
                    benefit: 'הבטחת הכנסה',
                    reason: 'הכנסה נמוכה, מתחת לגיל פרישה',
                    action: 'בדוק זכאות להבטחת הכנסה',
                    urgency: 'בינונית'
                });
            }
        } else if (incomeLevel === 'unknown') {
            this.results.medium_probability.push({
                benefit: 'השלמת/הבטחת הכנסה',
                reason: 'יש לבדוק הכנסה מדויקת',
                action: 'חשב הכנסה חודשית מדויקת',
                urgency: 'בינונית'
            });
        }
    }

    /**
     * גמלת סיעוד
     */
    analyzeNursingBenefit() {
        const age = this.ageCategory;
        const difficulty = this.answers.q9_daily_difficulty;
        const assistance = this.answers.q11_daily_assistance;
        const difficultyTypes = this.answers.q10_difficulty_types || [];
        const currentBenefits = this.answers.q17_current_benefits || [];
        const worsening = this.answers.q18_condition_worsening;
        const livingWith = this.answers.q16_caregiver;

        if (currentBenefits.includes('nursing')) {
            if (worsening === 'yes') {
                this.results.high_probability.push({
                    benefit: 'הגדלת גמלת סיעוד',
                    reason: 'החמרה במצב + כבר מקבל סיעוד',
                    action: 'יש להגיש בקשה להחמרת מצב',
                    urgency: 'גבוהה'
                });
            } else {
                this.results.additional_info.push({
                    benefit: 'גמלת סיעוד',
                    note: 'כבר מקבל - אין צורך בפעולה'
                });
            }
            return;
        }

        // חישוב רמת סבירות לסיעוד
        let nursingScore = 0;
        
        if (difficulty === 'severe') nursingScore += 3;
        else if (difficulty === 'moderate') nursingScore += 2;
        else if (difficulty === 'mild') nursingScore += 1;

        if (assistance === 'full') nursingScore += 3;
        else if (assistance === 'partial') nursingScore += 2;

        if (difficultyTypes.includes('supervision')) nursingScore += 2;
        if (difficultyTypes.length >= 3) nursingScore += 2;

        if (age === 'above_70') nursingScore += 1;

        if (nursingScore >= 6) {
            this.results.high_probability.push({
                benefit: 'גמלת סיעוד',
                reason: `קושי ${difficulty === 'severe' ? 'חמור' : difficulty === 'moderate' ? 'בינוני' : 'קל'} בתפקוד + צורך בסיוע ${assistance === 'full' ? 'מלא' : 'חלקי'}`,
                action: 'יש להגיש תביעה לגמלת סיעוד בביטוח לאומי',
                urgency: 'גבוהה',
                note: livingWith === 'yes' ? 'יש מטפל - ניתן לבחור בין שעות לכסף' : 'ניתן לקבל כסף או שעות סיוע'
            });
        } else if (nursingScore >= 3) {
            this.results.medium_probability.push({
                benefit: 'גמלת סיעוד',
                reason: 'קושי בתפקוד יומיומי',
                action: 'מומלץ להגיש תביעה ולעבור בדיקת ועדה רפואית',
                urgency: 'בינונית'
            });
        } else if (difficulty !== 'no') {
            this.results.medium_probability.push({
                benefit: 'גמלת סיעוד - עתידית',
                reason: 'קושי קל - לעקוב אחר התפתחות',
                action: 'תעד את הקשיים ועקוב אחר השינויים',
                urgency: 'נמוכה'
            });
        }
    }

    /**
     * נכות כללית
     */
    analyzeDisabilityBenefit() {
        const disability = this.answers.q12_disability;
        const previousClaim = this.answers.q13_previous_claim;
        const workLimitation = this.answers.q14_work_limitation;
        const age = this.ageCategory;
        const currentBenefits = this.answers.q17_current_benefits || [];

        if (currentBenefits.includes('disability')) {
            this.results.additional_info.push({
                benefit: 'נכות כללית',
                note: 'כבר מקבל'
            });
            return;
        }

        if (age !== 'under_retirement') {
            this.results.not_relevant.push({
                benefit: 'נכות כללית',
                reason: 'בגיל פרישה - נכות כללית לא רלוונטית'
            });
            return;
        }

        if (disability === 'yes' && workLimitation === 'yes') {
            if (previousClaim === 'rejected') {
                this.results.medium_probability.push({
                    benefit: 'נכות כללית - ערעור',
                    reason: 'נכות מוכרת + נדחה בעבר - אפשר לערער',
                    action: 'בדוק אפשרות להגיש ערעור או תביעה חדשה',
                    urgency: 'בינונית'
                });
            } else {
                this.results.high_probability.push({
                    benefit: 'נכות כללית',
                    reason: 'נכות רפואית + מגבלה תעסוקתית',
                    action: 'הגש תביעה לנכות כללית',
                    urgency: 'גבוהה'
                });
            }
        } else if (disability === 'not_checked' && workLimitation === 'yes') {
            this.results.medium_probability.push({
                benefit: 'נכות כללית',
                reason: 'מגבלה תעסוקתית - נדרשת בדיקת נכות',
                action: 'פנה לרופא לבדיקת נכות רפואית',
                urgency: 'בינונית'
            });
        }
    }

    /**
     * שאירים (אלמנות/אלמנים)
     */
    analyzeSurvivors() {
        const marital = this.answers.q3_marital;
        const currentBenefits = this.answers.q17_current_benefits || [];

        if (currentBenefits.includes('survivors')) {
            this.results.additional_info.push({
                benefit: 'קצבת שאירים',
                note: 'כבר מקבל'
            });
            return;
        }

        if (marital === 'widowed') {
            this.results.high_probability.push({
                benefit: 'קצבת שאירים (אלמן/ה)',
                reason: 'מצב משפחתי: אלמן/ה',
                action: 'הגש תביעה לקצבת שאירים',
                urgency: 'גבוהה'
            });
        }
    }

    /**
     * שירותים מיוחדים (שר״מ)
     */
    analyzeSpecialServices() {
        const age = this.ageCategory;
        const difficulty = this.answers.q9_daily_difficulty;
        
        if (age === 'above_70' && (difficulty === 'moderate' || difficulty === 'severe')) {
            this.results.medium_probability.push({
                benefit: 'שירותים מיוחדים (שר״מ)',
                reason: 'מעל גיל 70 + קושי תפקודי',
                action: 'בדוק זכאות לשירותים מיוחדים ברשות המקומית',
                urgency: 'בינונית'
            });
        }
    }

    /**
     * תוספות תלויים
     */
    analyzeDependents() {
        const dependents = this.answers.q5_dependent_children;
        const partner = this.answers.q4_partner_living;
        const orphans = this.answers.q6b_orphans;
        const currentBenefits = this.answers.q17_current_benefits || [];

        if (!currentBenefits.includes('senior') && !currentBenefits.includes('disability')) {
            return; // אין קצבה בסיסית
        }

        let dependentsCount = 0;
        if (dependents === '1') dependentsCount = 1;
        else if (dependents === '2') dependentsCount = 2;
        else if (dependents === '3_plus') dependentsCount = 3;

        if (orphans === '1') dependentsCount += 1;
        else if (orphans === '2') dependentsCount += 2;
        else if (orphans === '3_plus') dependentsCount += 3;

        if (partner === 'yes' || dependentsCount > 0) {
            this.results.high_probability.push({
                benefit: 'תוספות תלויים',
                reason: `${partner === 'yes' ? 'בן/בת זוג' : ''} ${dependentsCount > 0 ? `+ ${dependentsCount} ילדים תלויים` : ''}`,
                action: 'דרוש מביטוח לאומי הוספת תוספת תלויים',
                urgency: 'גבוהה'
            });
        }
    }

    /**
     * דמי הסתגלות
     */
    analyzeAdaptationBenefit() {
        const workEndReason = this.answers.q14a_work_end_reason;
        const workEndAge = this.answers.q14b_work_end_age;
        const insuranceMonths = this.answers.q13a_insurance_months;
        const pastBenefits = this.answers.q19a_past_benefits || [];

        if (pastBenefits.includes('adaptation')) {
            this.results.additional_info.push({
                benefit: 'דמי הסתגלות',
                note: 'קיבל בעבר'
            });
            return;
        }

        // זכאי רק אם הפסיק עבודה אחרי גיל פרישה
        if (workEndAge !== 'yes') {
            return;
        }

        // בדיקת סיבת סיום עבודה
        const relevantReasons = ['layoff', 'closure', 'health'];
        if (!relevantReasons.includes(workEndReason)) {
            return;
        }

        // בדיקת חודשי ביטוח
        if (insuranceMonths === 'under_60') {
            this.results.not_relevant.push({
                benefit: 'דמי הסתגלות',
                reason: 'מספר חודשי ביטוח נמוך מדי (פחות מ-60)'
            });
            return;
        }

        this.results.high_probability.push({
            benefit: 'דמי הסתגלות',
            reason: `הפסקת עבודה אחרי גיל פרישה עקב ${workEndReason === 'layoff' ? 'פיטורים' : workEndReason === 'closure' ? 'סגירת מקום עבודה' : 'מצב בריאותי'}`,
            action: 'הגש תביעה לדמי הסתגלות תוך 12 חודשים מסיום העבודה',
            urgency: 'דחופה - יש מגבלת זמן!',
            note: 'חשוב להגיש בהקדם - התביעה מוגבלת בזמן'
        });
    }

    /**
     * גמלת ילד נכה
     */
    analyzeDisabledChild() {
        const disabledChild = this.answers.q6a_disabled_child;
        const childAge = this.answers.q6a_child_age;

        if (disabledChild === 'yes') {
            this.results.high_probability.push({
                benefit: 'גמלת ילד נכה / תוספת ילד נכה',
                reason: `יש ילד עם נכות${childAge ? ` בגיל ${childAge}` : ''}`,
                action: 'בדוק זכאות לגמלת ילד נכה או תוספת על הקצבה',
                urgency: 'גבוהה'
            });
        }
    }

    /**
     * התייחסות מיוחדת לחבר קיבוץ/מושב
     */
    analyzeKibbutzMember() {
        const kibbutz = this.answers.q9a_kibbutz;

        if (kibbutz === 'kibbutz_shitufi') {
            this.results.additional_info.push({
                benefit: 'הערה מיוחדת',
                note: '⚠️ חבר קיבוץ שיתופי - יש כללים מיוחדים לחישוב הכנסה ונכסים. יש לפנות ליועץ מומחה בתחום.',
                urgency: 'חשוב'
            });
        } else if (kibbutz === 'kibbutz_mithadesh' || kibbutz === 'moshav_shitufi') {
            this.results.additional_info.push({
                benefit: 'הערה',
                note: `חבר ${kibbutz === 'kibbutz_mithadesh' ? 'קיבוץ מתחדש' : 'מושב שיתופי'} - ייתכנו כללים מיוחדים`,
                urgency: 'בינונית'
            });
        }
    }

    /**
     * השפעת רכבים על זכויות
     */
    analyzeVehicleImpact() {
        const vehicles = this.answers.q9b_vehicles;
        const incomeLevel = this.answers.q7_income_level;

        if ((vehicles === 'two' || vehicles === 'three_plus') && incomeLevel === 'below_threshold') {
            this.results.additional_info.push({
                benefit: 'אזהרה - רכבים',
                note: '⚠️ יותר מרכב אחד עלול למנוע השלמת/הבטחת הכנסה גם אם ההכנסה נמוכה',
                urgency: 'חשוב'
            });
        }
    }

    /**
     * הפקת דוח מסכם
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                high_probability: this.results.high_probability.length,
                medium_probability: this.results.medium_probability.length,
                not_relevant: this.results.not_relevant.length,
                additional_info: this.results.additional_info.length
            },
            details: this.results
        };

        return report;
    }
}

/**
 * פונקציה ראשית לניתוח השאלון
 */
function analyzeIntakeQuestionnaire(answers) {
    const analyzer = new IntakeAnalyzer(answers);
    analyzer.analyze();
    return analyzer.generateReport();
}

// ייצוא למודול (אם רלוונטי)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IntakeAnalyzer, analyzeIntakeQuestionnaire };
}
