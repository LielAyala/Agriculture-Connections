const express = require('express');
const router = express.Router();
const db = require('../database'); // שימוש ב- promisePool מה- database.js

// 📋 **טעינת כל המשימות מהטבלה**
router.get('/all', async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT gvm.*, gd.Name AS GroupName, fd.Name AS FarmerName, fd.Address AS FarmerLocation
            FROM GroupVolunteerMapping gvm
            JOIN GroupDetails gd ON gvm.GroupID = gd.ID
            JOIN FarmerDetails fd ON gvm.FarmerID = fd.ID
        `);
        res.status(200).json(results);
    } catch (err) {
        console.error("❌ Database Error:", err);
        res.status(500).json({ message: "❌ שגיאה במסד הנתונים", error: err.message });
    }
});

// ➕ **הוספת משימה חדשה לטבלה**
router.post('/add', async (req, res) => {
    const { GroupID, FarmerID, DateAssigned, Status, Notes, StartTime, EndTime, Rating, Area } = req.body;

    try {
        const query = `
            INSERT INTO GroupVolunteerMapping
            (GroupID, FarmerID, DateAssigned, Status, Notes, StartTime, EndTime, Rating, Area)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [GroupID, FarmerID, DateAssigned, Status, Notes, StartTime, EndTime, Rating, Area];

        await db.query(query, values);
        res.status(201).json({ message: "✅ משימה נוספה בהצלחה!" });
    } catch (err) {
        console.error("❌ Database Error:", err);
        res.status(500).json({ message: "❌ שגיאה בהוספת משימה", error: err.message });
    }
});

// 📝 **עדכון משימה לפי ID**
router.patch('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { DateAssigned, Status, Notes, StartTime, EndTime, Rating, Area } = req.body;

    try {
        const query = `
            UPDATE GroupVolunteerMapping SET
            DateAssigned = ?, Status = ?, Notes = ?, StartTime = ?, EndTime = ?, Rating = ?, Area = ?
            WHERE ID = ?
        `;
        const values = [DateAssigned, Status, Notes, StartTime, EndTime, Rating, Area, id];

        const [result] = await db.query(query, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "⚠️ משימה לא נמצאה לעדכון" });
        }

        res.status(200).json({ message: "✅ משימה עודכנה בהצלחה!" });
    } catch (err) {
        console.error("❌ Database Error:", err);
        res.status(500).json({ message: "❌ שגיאה בעדכון משימה", error: err.message });
    }
});

// 🗑️ **מחיקת משימה לפי ID**
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query("DELETE FROM GroupVolunteerMapping WHERE ID = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "⚠️ משימה לא נמצאה למחיקה" });
        }

        res.status(200).json({ message: "✅ משימה נמחקה בהצלחה!" });
    } catch (err) {
        console.error("❌ Database Error:", err);
        res.status(500).json({ message: "❌ שגיאה במחיקת משימה", error: err.message });
    }
});

module.exports = router;
