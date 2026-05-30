const db = require('../database');

// דוח סטטיסטיקות כללי
const getReport = async (req, res) => {
    try {
        const { period } = req.query; // day, week, month, all

        let dateFilter = '';
        if (period === 'day')   dateFilter = 'AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)';
        if (period === 'week')  dateFilter = 'AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)';
        if (period === 'month') dateFilter = 'AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';

        const [[{ totalFarmers }]]    = await db.query('SELECT COUNT(*) AS totalFarmers FROM farmers');
        const [[{ totalVolunteers }]] = await db.query('SELECT COUNT(*) AS totalVolunteers FROM volunteers');
        const [[{ openTasks }]]       = await db.query(`SELECT COUNT(*) AS openTasks FROM tasks t WHERE status = "open" ${dateFilter}`);
        const [[{ assignedTasks }]]   = await db.query(`SELECT COUNT(*) AS assignedTasks FROM tasks t WHERE status = "assigned" ${dateFilter}`);
        const [[{ completedTasks }]]  = await db.query(`SELECT COUNT(*) AS completedTasks FROM tasks t WHERE status = "completed" ${dateFilter}`);
        const [[{ farmersWaiting }]]  = await db.query(`SELECT COUNT(DISTINCT farmer_id) AS farmersWaiting FROM tasks t WHERE status = "open" ${dateFilter}`);
        const [[{ farmersHelped }]]   = await db.query(`SELECT COUNT(DISTINCT farmer_id) AS farmersHelped FROM tasks t WHERE status IN ("assigned","completed") ${dateFilter}`);

        res.json({ totalFarmers, totalVolunteers, openTasks, assignedTasks, completedTasks, farmersWaiting, farmersHelped });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת הדוח' });
    }
};

// כל ההתנדבויות עם פרטים מלאים
const getAllTasks = async (req, res) => {
    try {
        const { status, period } = req.query;

        let dateFilter = '';
        if (period === 'day')   dateFilter = 'AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)';
        if (period === 'week')  dateFilter = 'AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)';
        if (period === 'month') dateFilter = 'AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';

        let statusFilter = status ? `AND t.status = '${db.escape(status).replace(/'/g,"")}'` : '';

        const [tasks] = await db.query(`
            SELECT t.*,
                   f.name AS farmer_name, f.location, f.phone AS farmer_phone, f.dunams,
                   v.name AS volunteer_name, v.phone AS volunteer_phone, v.group_size, v.is_group
            FROM tasks t
            JOIN farmers f ON t.farmer_id = f.id
            LEFT JOIN volunteers v ON t.volunteer_id = v.id
            WHERE 1=1 ${dateFilter}
            ${status ? 'AND t.status = ?' : ''}
            ORDER BY t.created_at DESC
        `, status ? [status] : []);
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת ההתנדבויות' });
    }
};

// קבוצות שיצאו (assigned + completed) - עם פרטים
const getActiveVolunteers = async (req, res) => {
    try {
        const { period } = req.query;
        let dateFilter = '';
        if (period === 'day')   dateFilter = 'AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)';
        if (period === 'week')  dateFilter = 'AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)';
        if (period === 'month') dateFilter = 'AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';

        const [rows] = await db.query(`
            SELECT v.name, v.phone, v.group_size, v.is_group,
                   t.title, t.work_type, t.start_date, t.status,
                   f.name AS farmer_name, f.location
            FROM tasks t
            JOIN volunteers v ON t.volunteer_id = v.id
            JOIN farmers f ON t.farmer_id = f.id
            WHERE t.status IN ('assigned','completed') ${dateFilter}
            ORDER BY t.start_date DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת המתנדבים' });
    }
};

// חקלאים שקיבלו/ממתינים לסיוע
const getFarmersStatus = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT f.name, f.location, f.phone, f.dunams, f.crop_type,
                   COUNT(CASE WHEN t.status IN ('assigned','completed') THEN 1 END) AS tasks_helped,
                   COUNT(CASE WHEN t.status = 'open' THEN 1 END) AS tasks_waiting
            FROM farmers f
            LEFT JOIN tasks t ON f.id = t.farmer_id
            GROUP BY f.id
            ORDER BY tasks_waiting DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת החקלאים' });
    }
};

module.exports = { getReport, getAllTasks, getActiveVolunteers, getFarmersStatus };
