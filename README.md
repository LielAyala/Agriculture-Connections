# Agricultural Volunteers - חיבורים חקלאים ומתנדבים

פלטפורמה לחיבור חקלאים עם מתנדבים דרך עמותות וארגונים.

## על הפרויקט
המערכת מאפשרת לחקלאים להעלות צרכים (מספר מתנדבים, סוג עבודה, תאריכים),
למתנדבים לחפש ולהירשם להתנדבויות, ולעמותות לנהל הכל ולהפיק דוחות.

## טכנולוגיות
- **Backend:** Node.js + Express.js
- **Frontend:** EJS (server-side rendering)
- **Database:** MySQL
- **Auth:** bcrypt + express-session

## התקנה והפעלה

### דרישות
- Node.js v18+
- MySQL 8+

### הגדרת מסד נתונים
```bash
mysql -u root -p < sql/agricultural_volunteers.sql
```

### הפעלת השרת
```bash
cp .env.example .env
# ערוך את .env עם הגדרות MySQL שלך
npm install
npm run dev
```

פתח בדפדפן: `http://localhost:3000`

## מבנה הפרויקט
```
├── controllers/     # לוגיקה עסקית
├── routes/          # ניתוב
├── middleware/       # אימות הרשאות
├── views/           # תבניות EJS
├── public/          # CSS + JavaScript
├── sql/             # קובץ יצירת מסד נתונים
├── database.js      # התחברות למסד נתונים
└── server.js        # כניסה ראשית
```

## תכונות עיקריות
- הרשמה והתחברות לפי תפקיד (חקלאי / מתנדב / עמותה)
- חקלאים - פרסום משימות, ניהול מתנדבים
- מתנדבים - חיפוש והרשמה להתנדבויות
- עמותות - דוחות, סטטיסטיקות, מעקב פעילות
- ולידציה מלאה בצד השרת
