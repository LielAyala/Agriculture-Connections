const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
const cors = require('cors');
app.use(cors());


//ייבוא של ראוטרים
const adminDEMO = require('./routes/system_administrator');// ייבוא ה-router של המנהל
const farmerDetailsR=require('./routes/farmerDetails');
const filesR=require('./routes/files');
const groupDetailsR=require('./routes/groupDetails');
const groupVolunteerMappingR=require('./routes/groupVolunteerMapping');
const systemMetricsR=require('./routes/systemMetrics');
const usersR=require('./routes/users');
const volunteerAssignmentsR=require('./routes/volunteerAssignments');

// חיבור למסד הנתונים
const db_pool = require('./database').pool;


db_pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to the database!');
    connection.release(); // שחרור החיבור
});

const path = require('path');
console.log('Database module path:', path.resolve('./database'));
//const db_pool = require('./database').pool;


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
    console.log(`Server is running on port ${PORT}`);
    console.log('Database Connection Info:', {
      host: config.HOST,
      user: config.USER,
      database: config.DATABASE
  });
});

// שימוש ב-parser של express לקבלת נתונים בגוף הבקשה (req.body)
app.use(express.json());


// חיבור לנתיב  
// כל הבקשות ל-'/***' ינותבו ל-router הרלבנטי
app.use("/admin", adminDEMO);
app.use("/farmerD",farmerDetailsR);
app.use("/files",filesR);
app.use("/groupD",groupDetailsR);
app.use("/groupVolunteerMapping",groupVolunteerMappingR);
app.use("/systemMetrics",systemMetricsR);
app.use("/users",usersR);
app.use("/volunteerAssignments",volunteerAssignmentsR);
// הגדרת נתיב לדף הרישום

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

// גישה לנתיב בסיסי
app.get('/', (req, res) => {
    console.log("הגעת לנתיב הראשי");  // להוסיף הודעה למסוף
    res.send('Server is running!');
});