# הוראות לעבודה בפרויקט

## עדכוני ביטוח לאומי (NII)

אחרי כל שינוי ב-`BTL/senior_rights/data/nii-constants.json` — להריץ:

```
python update_nii_values.py
```

הסקריפט מעדכן ערכי fallback ב-`<span data-nii="...">` בכל קבצי ה-HTML תחת `BTL/senior_rights/`.
