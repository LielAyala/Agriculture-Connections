const db = require('../database');

// פרופיל החקלאי המחובר
const getMyProfile = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM farmers WHERE user_id = ?', [req.session.userId]);
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
        const { name, phone, location, dunams, crop_type } = req.body;

        if (phone && !/^\d{10}$/.test(phone)) {
            return res.status(400).json({ error: 'מספר טלפון חייב להיות 10 ספרות' });
        }

        await db.query(
            'UPDATE farmers SET name=?, phone=?, location=?, dunams=?, crop_type=? WHERE user_id=?',
            [name, phone, location, dunams, crop_type, req.session.userId]
        );

        res.json({ message: 'הפרופיל עודכן בהצלחה' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בעדכון הפרופיל' });
    }
};

// המשימות של החקלאי
const getMyTasks = async (req, res) => {
    try {
        const [farmerRows] = await db.query('SELECT id FROM farmers WHERE user_id = ?', [req.session.userId]);
        if (farmerRows.length === 0) return res.status(404).json({ error: 'פרופיל לא נמצא' });

        const [tasks] = await db.query(
            `SELECT t.*, v.name AS volunteer_name, v.phone AS volunteer_phone
             FROM tasks t
             LEFT JOIN volunteers v ON t.volunteer_id = v.id
             WHERE t.farmer_id = ?
             ORDER BY t.created_at DESC`,
            [farmerRows[0].id]
        );

        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת המשימות' });
    }
};

module.exports = { getMyProfile, updateMyProfile, getMyTasks };
