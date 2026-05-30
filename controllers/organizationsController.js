const db = require('../database');

// פרופיל העמותה
const getMyProfile = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM organizations WHERE user_id = ?', [req.session.userId]);
        if (rows.length === 0) return res.status(404).json({ error: 'פרופיל לא נמצא' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת הפרופיל' });
    }
};

// דוח סטטיסטיקות
const getReport = async (req, res) => {
    try {
        const [[{ totalFarmers }]]    = await db.query('SELECT COUNT(*) AS totalFarmers FROM farmers');
        const [[{ totalVolunteers }]] = await db.query('SELECT COUNT(*) AS totalVolunteers FROM volunteers');
        const [[{ openTasks }]]       = await db.query('SELECT COUNT(*) AS openTasks FROM tasks WHERE status = "open"');
        const [[{ assignedTasks }]]   = await db.query('SELECT COUNT(*) AS assignedTasks FROM tasks WHERE status = "assigned"');
        const [[{ completedTasks }]]  = await db.query('SELECT COUNT(*) AS completedTasks FROM tasks WHERE status = "completed"');
        const [[{ farmersWaiting }]]  = await db.query('SELECT COUNT(DISTINCT farmer_id) AS farmersWaiting FROM tasks WHERE status = "open"');
        const [[{ farmersHelped }]]   = await db.query('SELECT COUNT(DISTINCT farmer_id) AS farmersHelped FROM tasks WHERE status IN ("assigned","completed")');

        res.json({
            totalFarmers,
            totalVolunteers,
            openTasks,
            assignedTasks,
            completedTasks,
            farmersWaiting,
            farmersHelped
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת הדוח' });
    }
};

// כל המשימות עם פרטים מלאים
const getAllTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let query = `
            SELECT t.*, f.name AS farmer_name, f.location, f.phone AS farmer_phone,
                   v.name AS volunteer_name, v.phone AS volunteer_phone, v.group_size
            FROM tasks t
            JOIN farmers f ON t.farmer_id = f.id
            LEFT JOIN volunteers v ON t.volunteer_id = v.id
        `;
        const params = [];
        if (status) { query += ' WHERE t.status = ?'; params.push(status); }
        query += ' ORDER BY t.created_at DESC';

        const [tasks] = await db.query(query, params);
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת המשימות' });
    }
};

module.exports = { getMyProfile, getReport, getAllTasks };
