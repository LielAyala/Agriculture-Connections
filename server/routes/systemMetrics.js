const express = require('express');
const router = express.Router();
const db = require('../database'); // חיבור למסד הנתונים

// 📋 **שליפת כל הנתונים מהמערכת**
router.get('/all', async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM systemmetrics");
        res.status(200).json(results);
    } catch (err) {
        console.error("❌ Database Error:", err);
        res.status(500).json({ message: "❌ שגיאה במסד הנתונים", error: err.message });
    }
});

// ➕ **הוספת מדד חדש**
router.post('/add', async (req, res) => {
    const {
        Date, SummaryDate, FarmersReceivedAssistance, FarmersDidNotReceiveAssistance, FarmersRegistered,
        FarmersSentForm, FarmersSentStatement, GroupsRegistered, GroupsLeft,
        GroupsWantPermanentVolunteering, QuantityOfDunamsForContract, FarmerID, GroupID, VolunteerID
    } = req.body;

    try {
        const query = `
            INSERT INTO systemmetrics 
            (Date, SummaryDate, FarmersReceivedAssistance, FarmersDidNotReceiveAssistance, FarmersRegistered,
            FarmersSentForm, FarmersSentStatement, GroupsRegistered, GroupsLeft,
            GroupsWantPermanentVolunteering, QuantityOfDunamsForContract, FarmerID, GroupID, VolunteerID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [Date, SummaryDate, FarmersReceivedAssistance, FarmersDidNotReceiveAssistance,
            FarmersRegistered, FarmersSentForm, FarmersSentStatement, GroupsRegistered, GroupsLeft,
            GroupsWantPermanentVolunteering, QuantityOfDunamsForContract, FarmerID, GroupID, VolunteerID]);

        res.status(201).json({ message: "✅ מדד מערכת נוסף בהצלחה!" });
    } catch (err) {
        console.error("❌ Database Error:", err);
        res.status(500).json({ message: "❌ שגיאה בהוספת מדד מערכת", error: err.message });
    }
});

// 🔄 **עדכון מדד קיים**
// 🔄 **עדכון מדד קיים**
router.patch('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // בדיקת קיום ה-ID
        const [existing] = await db.query("SELECT * FROM systemmetrics WHERE ID = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "⚠️ המדד לא נמצא לעדכון" });
        }

        // יצירת שאילתת עדכון דינמית
        let updateQuery = "UPDATE systemmetrics SET ";
        let updateValues = [];
        Object.keys(updates).forEach((key, index) => {
            updateQuery += `${key} = ?${index < Object.keys(updates).length - 1 ? ', ' : ' '}`;
            updateValues.push(updates[key]);
        });
        updateQuery += "WHERE ID = ?";
        updateValues.push(id);

        await db.query(updateQuery, updateValues);

        res.status(200).json({ message: "✅ מדד עודכן בהצלחה!" });
    } catch (err) {
        console.error("❌ Database Error:", err);
        res.status(500).json({ message: "❌ שגיאה בעדכון מדד", error: err.message });
    }
});


// 🗑️ **מחיקת מדד לפי ID**
// 🗑️ **מחיקת מדד לפי ID**
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [existing] = await db.query("SELECT * FROM systemmetrics WHERE ID = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "⚠️ המדד לא נמצא למחיקה" });
        }

        await db.query("DELETE FROM systemmetrics WHERE ID = ?", [id]);

        res.status(200).json({ message: "✅ מדד נמחק בהצלחה!" });
    } catch (err) {
        console.error("❌ Database Error:", err);
        res.status(500).json({ message: "❌ שגיאה במחיקת מדד", error: err.message });
    }
});

module.exports = router;
