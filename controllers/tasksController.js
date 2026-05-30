const db = require('../database');

// כל ההתנדבויות - עם פילטרים לפי מיקום, תאריך, גודל קבוצה, סוג עבודה
const getAllTasks = async (req, res) => {
    try {
        const { status, work_type, location, date, group_size } = req.query;

        let query = `
            SELECT t.*, f.name AS farmer_name, f.location, f.crop_type, f.phone AS farmer_phone
            FROM tasks t
            JOIN farmers f ON t.farmer_id = f.id
            WHERE 1=1
        `;
        const params = [];

        if (status)    { query += ' AND t.status = ?';              params.push(status); }
        if (work_type) { query += ' AND t.work_type = ?';           params.push(work_type); }
        if (location)  { query += ' AND f.location LIKE ?';         params.push(`%${location}%`); }
        if (date)      { query += ' AND t.start_date <= ? AND t.end_date >= ?'; params.push(date, date); }
        if (group_size){ query += ' AND t.volunteers_needed >= ?';  params.push(parseInt(group_size)); }

        query += ' ORDER BY t.created_at DESC';

        const [tasks] = await db.query(query, params);
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת ההתנדבויות' });
    }
};

// התנדבות בודדת
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

        if (rows.length === 0) return res.status(404).json({ error: 'התנדבות לא נמצאה' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת ההתנדבות' });
    }
};

// יצירת התנדבות (חקלאי)
const createTask = async (req, res) => {
    try {
        const { title, description, work_type, volunteers_needed, work_hours, start_date, end_date } = req.body;

        const [farmerRows] = await db.query('SELECT id FROM farmers WHERE user_id = ?', [req.session.userId]);
        if (farmerRows.length === 0) return res.status(404).json({ error: 'פרופיל חקלאי לא נמצא' });

        const [result] = await db.query(
            `INSERT INTO tasks (farmer_id, title, description, work_type, volunteers_needed, work_hours, start_date, end_date)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [farmerRows[0].id, title, description, work_type, volunteers_needed || 1, work_hours || '', start_date, end_date]
        );

        res.status(201).json({ message: 'ההתנדבות פורסמה בהצלחה!', taskId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בפרסום ההתנדבות' });
    }
};

// שיבוץ מתנדב - UPDATE מהיר
const assignTask = async (req, res) => {
    try {
        const [taskRows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        if (taskRows.length === 0) return res.status(404).json({ error: 'התנדבות לא נמצאה' });
        if (taskRows[0].status !== 'open') return res.status(400).json({ error: 'ההתנדבות כבר לא פתוחה' });

        const [volRows] = await db.query('SELECT id FROM volunteers WHERE user_id = ?', [req.session.userId]);
        if (volRows.length === 0) return res.status(404).json({ error: 'פרופיל מתנדב לא נמצא' });

        await db.query(
            'UPDATE tasks SET volunteer_id = ?, status = "assigned" WHERE id = ?',
            [volRows[0].id, req.params.id]
        );

        res.json({ message: 'נרשמת להתנדבות בהצלחה!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה ברישום להתנדבות' });
    }
};

// סיום (חקלאי)
const completeTask = async (req, res) => {
    try {
        const [farmerRows] = await db.query('SELECT id FROM farmers WHERE user_id = ?', [req.session.userId]);
        if (farmerRows.length === 0) return res.status(404).json({ error: 'פרופיל חקלאי לא נמצא' });

        const [result] = await db.query(
            'UPDATE tasks SET status = "completed" WHERE id = ? AND farmer_id = ?',
            [req.params.id, farmerRows[0].id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'התנדבות לא נמצאה' });
        res.json({ message: 'ההתנדבות סומנה כהושלמה' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בסיום ההתנדבות' });
    }
};

// ביטול (חקלאי)
const cancelTask = async (req, res) => {
    try {
        const [farmerRows] = await db.query('SELECT id FROM farmers WHERE user_id = ?', [req.session.userId]);
        if (farmerRows.length === 0) return res.status(404).json({ error: 'פרופיל חקלאי לא נמצא' });

        await db.query(
            'UPDATE tasks SET status = "cancelled" WHERE id = ? AND farmer_id = ?',
            [req.params.id, farmerRows[0].id]
        );
        res.json({ message: 'ההתנדבות בוטלה' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בביטול ההתנדבות' });
    }
};

module.exports = { getAllTasks, getTaskById, createTask, assignTask, completeTask, cancelTask };
