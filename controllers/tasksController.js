const db = require('../database');

// כל המשימות הפתוחות
const getAllTasks = async (req, res) => {
    try {
        const { status, work_type } = req.query;

        let query = `
            SELECT t.*, f.name AS farmer_name, f.location, f.crop_type
            FROM tasks t
            JOIN farmers f ON t.farmer_id = f.id
            WHERE 1=1
        `;
        const params = [];

        if (status)    { query += ' AND t.status = ?';    params.push(status); }
        if (work_type) { query += ' AND t.work_type = ?'; params.push(work_type); }

        query += ' ORDER BY t.created_at DESC';

        const [tasks] = await db.query(query, params);
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת המשימות' });
    }
};

// משימה בודדת
const getTaskById = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.*, f.name AS farmer_name, f.location, f.phone AS farmer_phone, f.crop_type,
                   v.name AS volunteer_name, v.phone AS volunteer_phone, v.group_size
            FROM tasks t
            JOIN farmers f ON t.farmer_id = f.id
            LEFT JOIN volunteers v ON t.volunteer_id = v.id
            WHERE t.id = ?
        `, [req.params.id]);

        if (rows.length === 0) return res.status(404).json({ error: 'משימה לא נמצאה' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת המשימה' });
    }
};

// יצירת משימה (חקלאי)
const createTask = async (req, res) => {
    try {
        const { title, description, work_type, volunteers_needed, start_date, end_date } = req.body;

        const [farmerRows] = await db.query('SELECT id FROM farmers WHERE user_id = ?', [req.session.userId]);
        if (farmerRows.length === 0) return res.status(404).json({ error: 'פרופיל חקלאי לא נמצא' });

        const farmerId = farmerRows[0].id;

        const [result] = await db.query(
            `INSERT INTO tasks (farmer_id, title, description, work_type, volunteers_needed, start_date, end_date)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [farmerId, title, description, work_type, volunteers_needed || 1, start_date, end_date]
        );

        res.status(201).json({ message: 'המשימה נוצרה בהצלחה', taskId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה ביצירת המשימה' });
    }
};

// שיבוץ מתנדב למשימה
const assignTask = async (req, res) => {
    try {
        const [taskRows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        if (taskRows.length === 0) return res.status(404).json({ error: 'משימה לא נמצאה' });

        const task = taskRows[0];
        if (task.status !== 'open') return res.status(400).json({ error: 'המשימה כבר לא פתוחה' });

        const [volRows] = await db.query('SELECT id FROM volunteers WHERE user_id = ?', [req.session.userId]);
        if (volRows.length === 0) return res.status(404).json({ error: 'פרופיל מתנדב לא נמצא' });

        // עדכון מהיר - UPDATE
        await db.query(
            'UPDATE tasks SET volunteer_id = ?, status = "assigned" WHERE id = ?',
            [volRows[0].id, req.params.id]
        );

        res.json({ message: 'נרשמת למשימה בהצלחה!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה ברישום למשימה' });
    }
};

// סיום משימה (חקלאי)
const completeTask = async (req, res) => {
    try {
        const [farmerRows] = await db.query('SELECT id FROM farmers WHERE user_id = ?', [req.session.userId]);
        if (farmerRows.length === 0) return res.status(404).json({ error: 'פרופיל חקלאי לא נמצא' });

        const [result] = await db.query(
            'UPDATE tasks SET status = "completed" WHERE id = ? AND farmer_id = ?',
            [req.params.id, farmerRows[0].id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ error: 'משימה לא נמצאה' });
        res.json({ message: 'המשימה הסתיימה בהצלחה' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בסיום המשימה' });
    }
};

// ביטול משימה (חקלאי)
const cancelTask = async (req, res) => {
    try {
        const [farmerRows] = await db.query('SELECT id FROM farmers WHERE user_id = ?', [req.session.userId]);
        if (farmerRows.length === 0) return res.status(404).json({ error: 'פרופיל חקלאי לא נמצא' });

        await db.query(
            'UPDATE tasks SET status = "cancelled" WHERE id = ? AND farmer_id = ?',
            [req.params.id, farmerRows[0].id]
        );

        res.json({ message: 'המשימה בוטלה' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בביטול המשימה' });
    }
};

module.exports = { getAllTasks, getTaskById, createTask, assignTask, completeTask, cancelTask };
