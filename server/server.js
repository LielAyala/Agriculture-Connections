const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
const cors = require('cors');
app.use(cors());
// חיבור למסד הנתונים
const db_pool = require('./database').pool;
const path = require('path');
// הגדרת קבצים סטטיים מהתיקייה pront כל הקבצים ב-pront/ יהיו זמינים
app.use(express.static(path.join(__dirname, 'pront')));




//ייבוא של ראוטרים
const farmerDetailsR=require('./routes/farmerDetails');
const filesR=require('./routes/files');
const groupDetailsR=require('./routes/groupDetails');
const groupVolunteerMappingR=require('./routes/groupVolunteerMapping');
const systemMetricsR=require('./routes/systemMetrics');
const usersR=require('./routes/users');
const volunteerAssignmentsR=require('./routes/volunteerAssignments');




db_pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to the database!');
    connection.release(); // שחרור החיבור
});

console.log('Database module path:', path.resolve('./database'));


// הערכים הישירים
const config = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: '',
    DATABASE: 'agriculture connections'
};
// הדפס את הערכים כדי לוודא שהם קיימים
console.log(config);

// הגדרת השרת להקשיב על הפורט 3333
const PORT = 3333; // הגדרת הפורט החדש
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
//     console.log('Database Connection Info:', {
//       host: config.HOST,
//       user: config.USER,
//       database: config.DATABASE
//   });
});

// שימוש ב-parser של express לקבלת נתונים בגוף הבקשה (req.body)
app.use(express.json());


// חיבור לנתיב  
// כל הבקשות ל-'/***' ינותבו ל-router הרלבנטי
app.use("/farmerD",farmerDetailsR);
app.use("/files",filesR);
app.use("/groupD",groupDetailsR);
app.use("/groupVolunteerMapping",groupVolunteerMappingR);
app.use("/systemMetrics",systemMetricsR);
app.use("/users",usersR);
app.use("/volunteerAssignments",volunteerAssignmentsR);
app.use((err, req, res, next) => {
    console.error("❌ שגיאה:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

app.get('/files/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'pront', 'uploadF.html')); // התאמה למיקום בפועל
});
// הגדרת נתיב לדף הרישום
app.get('/register', (req, res) => {
    console.log(__dirname);  // יפלט את המיקום של הקובץ שמריץ את השרת
    console.log(path.join(__dirname, '/pront/register.html')); // יראה את הנתיב המלא של הקובץ
    res.sendFile(path.join(__dirname, '/pront/register.html'));
});
// הגדרת נתיב לדף ההתחברות
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/pront/login.html')); // הצגת דף ה-HTML של ההתחברות
});
app.get('/farmer/dashboard', (req, res) => {
    res.send('🔶 ברוך הבא חקלאי! זה האזור האישי שלך');
});

app.get('/group/dashboard', (req, res) => {
    res.send('🟦 ברוכה הבאה קבוצת מתנדבים! זה האזור האישי שלכם');
});

// נתיב להצגת דף ניהול החקלאים
app.get('/farmers', (req, res) => {
    res.sendFile(path.join(__dirname, 'pront', 'farmers.html'));
});
//נתיב להצגת קבוצות
app.get('/grups', (req, res) => {
    res.sendFile(path.join(__dirname, 'pront', 'groups.html'));
    
});
//נתיב לקביעת התנדבות 
app.get('/groupVolunteerMapping', (req, res) => {
    res.sendFile(path.join(__dirname, 'pront', 'groupVolunteerMapping.html'));
});
app.get('/systemMetrics', (req, res) => {
    res.sendFile(path.join(__dirname, 'pront', 'systemMetrics.html'));
});


// גישה לנתיב בסיסי
app.get('/', (req, res) => {
    console.log("הגעת לנתיב הראשי");  // להוסיף הודעה למסוף
    res.send('Server is running!');
});