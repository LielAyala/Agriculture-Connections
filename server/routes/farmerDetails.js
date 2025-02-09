const express = require('express');
const router = express.Router();
const pool = require('../database'); // ייבוא pool בצורה נכונה
// בדיקה אם `pool` קיים לפני כל פעולה
if (!pool) {
    console.error("❌ pool אינו מוגדר! יש בעיה בחיבור למסד הנתונים.");
}
// 🔹 **שליפת כל החקלאים**
router.get('/All', async (req, res) => {
    try {
        console.log("📡 בקשה התקבלה: טעינת כל החקלאים");

        // בדיקה אם `pool` מוגדר נכון
        if (!pool) {
            console.error("❌ שגיאה: pool אינו מוגדר!");
            return res.status(500).json({ message: "❌ שגיאה פנימית - אין חיבור למסד הנתונים" });
        }

        const [results] = await pool.query('SELECT * FROM farmerdetails');

        console.log("🔍 תוצאות שהתקבלו ממסד הנתונים:", results);

        if (!results || results.length === 0) {
            console.log("⚠️ אין חקלאים במערכת");
            return res.status(404).json({ message: "⚠️ אין חקלאים במערכת" });
        }

        console.log("✅ החקלאים נטענו בהצלחה!");
        res.json(results);
    } catch (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ message: "❌ שגיאה במסד הנתונים", error: err.message });
    }
});
// 🔹 **חיפוש חקלאי לפי שם או שם חווה**
router.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
      console.log(`📡 חיפוש חקלאים עם הערך: "${query}"`);

      if (!query) {
          console.log("❌ השאילתא ריקה!");
          return res.status(400).json({ message: "❌ נא להזין שם לחיפוש!" });
      }

      const sqlQuery = `
          SELECT * FROM farmerdetails
          WHERE Name LIKE ? OR FarmName LIKE ?
      `;
      const searchValue = `%${query}%`;

      const [results] = await pool.query(sqlQuery, [searchValue, searchValue]);

      console.log("✅ תוצאות שהתקבלו:", results);

      if (!results || results.length === 0) {
          console.log("⚠️ לא נמצאו חקלאים בשם הזה.");
          return res.status(404).json({ message: "⚠️ לא נמצאו חקלאים בשם הזה" });
      }

      res.json(results);
  } catch (err) {
      console.error("❌ Database Error:", err);
      res.status(500).json({ message: "❌ שגיאה במסד הנתונים", error: err.message || err });
  }
});
// 🔹 **הוספת חקלאי חדש *
router.post('/Add', async (req, res) => {
  const {
      Name, FarmName, Telephone, Email, Address, QuantityOfDunams, WorkingDays,
      BriefExplanationOfWork, IDNumber, RelevantStartTime, RelevantEndTime,
      DesiredVolunteersCount, ACTIV
  } = req.body;

  try {
      console.log("📡 קבלת נתונים להוספת חקלאי:", req.body);

      const query = `
          INSERT INTO farmerdetails
          (Name, FarmName, Telephone, Email, Address, QuantityOfDunams, WorkingDays, 
          BriefExplanationOfWork, IDNumber, RelevantStartTime, RelevantEndTime, DesiredVolunteersCount, ACTIV)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
          Name, FarmName, Telephone, Email, Address, QuantityOfDunams, WorkingDays,
          BriefExplanationOfWork, IDNumber, RelevantStartTime, RelevantEndTime,
          DesiredVolunteersCount, ACTIV
      ];

      console.log("📡 שליחת שאילתת INSERT:", query);
      console.log("📡 עם הערכים:", values);

      await pool.query(query, values);

      console.log("✅ חקלאי נוסף בהצלחה!");
      res.status(201).json({ message: '✅ חקלאי נוסף בהצלחה!' });
  } catch (err) {
      console.error("❌ Database Error:", err);
      res.status(500).json({ message: "❌ שגיאה בהוספת חקלאי", error: err.message || err });
  }
});
// 🔹 **עדכון חקלאי לפי ID**
router.patch('/Update/:id', async (req, res) => {
    const { id } = req.params;
    const {
        Name, FarmName, Telephone, Email, Address, QuantityOfDunams, WorkingDays,
        BriefExplanationOfWork, IDNumber, RelevantStartTime, RelevantEndTime,
        DesiredVolunteersCount, ACTIV
    } = req.body;

    try {
        console.log(`📡 קבלת בקשת עדכון לחקלאי עם ID: ${id}`);
        console.log("📡 נתונים חדשים:", req.body);

        const query = `
            UPDATE farmerdetails SET 
            Name = ?, FarmName = ?, Telephone = ?, Email = ?, Address = ?, 
            QuantityOfDunams = ?, WorkingDays = ?, BriefExplanationOfWork = ?, 
            IDNumber = ?, RelevantStartTime = ?, RelevantEndTime = ?, DesiredVolunteersCount = ?, ACTIV = ?
            WHERE ID = ?
        `;

        const [result] = await pool.query(query, [
            Name, FarmName, Telephone, Email, Address, QuantityOfDunams, WorkingDays,
            BriefExplanationOfWork, IDNumber, RelevantStartTime, RelevantEndTime, DesiredVolunteersCount, ACTIV, id
        ]);

        console.log("✅ תוצאות העדכון:", result);

        if (result.affectedRows === 0) {
            console.log("⚠️ חקלאי לא נמצא או שלא נעשה שינוי");
            return res.status(404).json({ message: "⚠️ חקלאי לא נמצא או שלא נעשה שינוי" });
        }

        res.status(200).json({ message: "✅ חקלאי עודכן בהצלחה!" });

    } catch (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ message: "❌ שגיאה בעדכון החקלאי", error: err.message });
    }
});
// 🔹 **מחיקת חקלאי לפי ID**
router.delete('/Delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
      console.log(`📡 בקשת מחיקה התקבלה לחקלאי עם ID: ${id}`);

      if (!id || isNaN(id)) {
          console.error("❌ שגיאה: ID לא תקין!");
          return res.status(400).json({ message: "❌ שגיאה: ID לא תקין!" });
      }

      const [result] = await pool.query('DELETE FROM farmerdetails WHERE ID = ?', [id]);

      console.log("🗑️ תוצאות מחיקה:", result);

      if (result.affectedRows === 0) {
          console.log("⚠️ חקלאי לא נמצא במערכת.");
          return res.status(404).json({ message: "⚠️ חקלאי לא נמצא במערכת." });
      }

      console.log("✅ חקלאי נמחק בהצלחה!");
      res.status(200).json({ message: "✅ חקלאי נמחק בהצלחה!" });

  } catch (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ message: "❌ שגיאה במסד הנתונים", error: err.message });
  }
});
module.exports = router;
