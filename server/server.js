const express = require('express');
const app = express();
const adminRouter = require('./system_administrator'); // ייבוא ה-router של המנהל
const db_pool = require('./database').pool; // ייבוא של pool החיבור למסד הנתונים

// הערכים הישירים
const config = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: '',
    DATABASE: 'agriculture connections'
};

// הדפס את הערכים כדי לוודא שהם קיימים
console.log(config);

// הגדרת השרת להקשיב על הפורט 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    console.log('Database Connection Info:', {
        host: config.HOST,
        user: config.USER,
        database: config.DATABASE
    });
});

// שימוש ב-parser של express לקבלת נתונים בגוף הבקשה (req.body)
app.use(express.json());

// חיבור לנתיב '/admin' 
app.use("/admin", adminRouter);  // כל הבקשות ל-'/admin' ינותבו ל-router של המנהל

// גישה לנתיב בסיסי
app.get('/', (req, res) => {
    console.log("הגעת לנתיב הראשי");  // להוסיף הודעה למסוף
    res.send('Server is running!');
});
