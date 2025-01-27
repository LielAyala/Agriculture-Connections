const express = require('express');
const db_pool = require('../database').pool;
const admin = express.Router(); // יצירת router חדש עבור הניהול של המנהל


// דוגמה לנתיב במנהל מערכת
admin.get('/all', (req, res) => {
    res.send('All admin data');
    console.log("הגעת למנהל");
});


// פונקציה להצגת משתמשים (GET)
admin.get("/List", (req, res) => {
    let q = "SELECT * FROM `users`";
    
    db_pool.query(q, function (err, rows, fields) {
        if (err) {
            console.error("Database error:", err); // הדפס את השגיאה בקונסול
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json(rows); // החזרת התוצאה כ-JSON
    });
});

    

// פונקציה להוספת משתמש (POST)
admin.post("/Add", (req, res) => {
    console.log('Request body:', req.body);  // הדפסת כל הגוף של הבקשה
    let { name, email } = req.body;
    console.log('Received data:', { name, email }); // הדפסת הנתונים האישיים שנשלחים

    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    let q = `INSERT INTO \`users\` (\`name\`, \`email\`) VALUES (?, ?)`;
    db_pool.query(q, [name, email], function (err, rows, fields) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error adding user", error: err.message, sqlMessage: err.sqlMessage });
        }
        res.status(200).json({ message: "User added successfully" });
    });
});




// פונקציה לעדכון משתמש (PATCH)
admin.patch("/Edit", (req, res) => {
    let { id, name, email } = req.body; // קבלת מזהה, שם ודואר אלקטרוני מהבקשה

    // יצירת שאילתת SQL לעדכון נתוני המשתמש במסד הנתונים
    let q = `UPDATE \`users\` SET \`name\`=?, \`email\`=? WHERE id=?`;
    db_pool.query(q, [name, email, id], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ message: err }); // במקרה של שגיאה, שלח הודעת שגיאה
        } else {
            res.status(200).json({ message: "User updated successfully" }); // אם הכל תקין, הודעה על עדכון מוצלח
        }
    });
});

// פונקציה למחיקת משתמש (DELETE)
admin.delete("/Del", (req, res) => {
    let { id } = req.body; // קבלת מזהה המשתמש למחיקה מהבקשה

    // יצירת שאילתת SQL למחיקת המשתמש ממסד הנתונים
    let q = `DELETE FROM \`users\` WHERE id=?`;
    db_pool.query(q, [id], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ message: err }); // במקרה של שגיאה, שלח הודעת שגיאה
        } else {
            res.status(200).json({ message: "User deleted successfully" }); // אם הכל תקין, הודעה על מחיקה מוצלחת
        }
    });
});

module.exports = admin;
