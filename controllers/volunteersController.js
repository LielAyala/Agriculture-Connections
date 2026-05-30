const db = require('../database');

// פרופיל המתנדב
const getMyProfile = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM volunteers WHERE user_id = ?', [req.session.userId]);
        if (rows.length === 0) return res.status(404).json({ error: 'פרופיל לא נמצא' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת הפרופיל' });
    }
};

// עדכון פרופיל
const updateMyProfile = async (req, res) => {
    try {
        const { name, phone, availability, skills, group_size } = req.body;

        if (phone && !/^\d{10}$/.test(phone)) {
            return res.status(400).json({ error: 'מספר טלפון חייב להיות 10 ספרות' });
        }

        const isGroup = (group_size || 1) > 1;

        await db.query(
            'UPDATE volunteers SET name=?, phone=?, availability=?, skills=?, group_size=?, is_group=? WHERE user_id=?',
            [name, phone, availability, skills, group_size || 1, isGroup, req.session.userId]
        );

        res.json({ message: 'הפרופיל עודכן בהצלחה' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בעדכון הפרופיל' });
    }
};

// המשימות שהמתנדב שובץ אליהן
const getMyTasks = async (req, res) => {
    try {
        const [volRows] = await db.query('SELECT id FROM volunteers WHERE user_id = ?', [req.session.userId]);
        if (volRows.length === 0) return res.status(404).json({ error: 'פרופיל לא נמצא' });

        const [tasks] = await db.query(
            `SELECT t.*, f.name AS farmer_name, f.location, f.phone AS farmer_phone
             FROM tasks t
             JOIN farmers f ON t.farmer_id = f.id
             WHERE t.volunteer_id = ?
             ORDER BY t.start_date ASC`,
            [volRows[0].id]
        );

        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת המשימות' });
    }
};

module.exports = { getMyProfile, updateMyProfile, getMyTasks };
