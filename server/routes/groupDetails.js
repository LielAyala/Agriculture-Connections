const express = require('express');
const groupDetailsRouter = express.Router();
const pool = require('../database'); // שימוש ב-promise()

// 🔹 **שליפת כל הקבוצות**
groupDetailsRouter.get('/all', async (req, res) => {
    try {
        console.log("📡 בקשה התקבלה: טעינת כל הקבוצות");

        const [results] = await pool.query("SELECT * FROM GroupDetails");

        if (!results || results.length === 0) {
            return res.status(404).json({ message: "⚠️ אין קבוצות במערכת" });
        }

        console.log("✅ הקבוצות נטענו בהצלחה!", results);
        res.json(results);
    } catch (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ message: "❌ שגיאה במסד הנתונים", error: err.message });
    }
});
// 🔹 **חיפוש קבוצות לפי שם**
groupDetailsRouter.get('/search', async (req, res) => {
    const { query } = req.query;

    try {
        console.log(`📡 חיפוש קבוצות עם השם או שם האחראי: "${query}"`);

        if (!query) {
            return res.status(400).json({ message: "❌ נא להזין שם קבוצה או שם אחראי לחיפוש!" });
        }

        const sqlQuery = `
            SELECT * FROM GroupDetails
            WHERE Name LIKE ? OR NameOfResponsible LIKE ?
        `;
        const searchValue = `%${query}%`;

        const [results] = await pool.query(sqlQuery, [searchValue, searchValue]);

        if (!results || results.length === 0) {
            return res.status(404).json({ message: "⚠️ לא נמצאו קבוצות עם השם או שם האחראי הזה" });
        }

        res.json(results);
    } catch (err) {
        console.error("❌ Database Error:", err);
        res.status(500).json({ message: "❌ שגיאה במסד הנתונים", error: err.message });
    }
});



// 🔹 **הוספת קבוצה חדשה**
groupDetailsRouter.post('/add', async (req, res) => {
    const { Email, IsPreparatorySchool, Name, NameOfResponsible, Phone, GroupQuantity, DateRange, RelevantStartTime, RelevantEndTime, PreferredArea, AgeRange, PermanentVolunteeringInterest, ACTIV } = req.body;

    try {
        console.log("📡 קבלת נתונים להוספת קבוצה:", req.body);

        if (!Name || !NameOfResponsible || !Phone) {
            return res.status(400).json({ message: "❌ חובה להזין שם קבוצה, שם אחראי וטלפון!" });
        }

        const query = `
            INSERT INTO GroupDetails 
            (Email, IsPreparatorySchool, Name, NameOfResponsible, Phone, GroupQuantity, DateRange, RelevantStartTime, RelevantEndTime, PreferredArea, AgeRange, PermanentVolunteeringInterest, ACTIV)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        console.log("📡 SQL INSERT Query:", query);

        const values = [
            Email || null, 
            IsPreparatorySchool || 0, 
            Name, 
            NameOfResponsible, 
            Phone, 
            GroupQuantity || 0, 
            DateRange || null, 
            RelevantStartTime || "00:00", 
            RelevantEndTime || "00:00", 
            PreferredArea || null, 
            AgeRange || null, 
            PermanentVolunteeringInterest || 0, 
            ACTIV || 0
        ];

        console.log("📡 עם הערכים:", values);

        await pool.query(query, values);

        console.log("✅ קבוצה נוספה בהצלחה!");
        res.status(201).json({ message: "✅ קבוצה נוספה בהצלחה!" });
    } catch (err) {
        console.error("❌ Database Error:", err);
        res.status(500).json({ message: "❌ שגיאה בהוספת קבוצה", error: err });
    }
});


// 🔹 **עדכון קבוצה קיימת לפי ID**
groupDetailsRouter.patch('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Email, IsPreparatorySchool, Name,
         NameOfResponsible, Phone, GroupQuantity, DateRange,
          RelevantStartTime, RelevantEndTime, PreferredArea, AgeRange,
           PermanentVolunteeringInterest, ACTIV } = req.body;

    try {
        const query = `
            UPDATE GroupDetails SET 
            Email = ?, IsPreparatorySchool = ?, Name = ?, 
            NameOfResponsible = ?, Phone = ?, GroupQuantity = ?,
            DateRange = ?, RelevantStartTime = ?, RelevantEndTime = ?,
             PreferredArea = ?, AgeRange = ?, PermanentVolunteeringInterest = ?, ACTIV = ?
            WHERE ID = ?
        `;

        const [result] = await pool.query(query, [Email, IsPreparatorySchool,
             Name, NameOfResponsible, Phone, GroupQuantity, DateRange, RelevantStartTime, 
             RelevantEndTime, PreferredArea, AgeRange, PermanentVolunteeringInterest, ACTIV, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "⚠️ קבוצה לא נמצאה או שלא נעשה שינוי" });
        }

        res.status(200).json({ message: "✅ קבוצה עודכנה בהצלחה!" });
    } catch (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ message: "❌ שגיאה בעדכון קבוצה", error: err.message });
    }
});
// 🔹 **מחיקת קבוצה לפי ID**
groupDetailsRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query("DELETE FROM GroupDetails WHERE ID = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "⚠️ קבוצה לא נמצאה במערכת" });
        }

        res.status(200).json({ message: "✅ קבוצה נמחקה בהצלחה!" });
    } catch (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ message: "❌ שגיאה במחיקת קבוצה", error: err.message });
    }
});

module.exports = groupDetailsRouter;
