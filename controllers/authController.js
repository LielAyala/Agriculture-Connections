const bcrypt = require('bcrypt');
const db = require('../database');

// הרשמה
const register = async (req, res) => {
    try {
        const { username, email, password, role, name, phone, location, dunams, crop_type, group_size } = req.body;

        if (!['farmer', 'volunteer', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'תפקיד לא תקין' });
        }

        if (phone && !/^\d{10}$/.test(phone)) {
            return res.status(400).json({ error: 'מספר טלפון חייב להיות 10 ספרות' });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'שם משתמש או אימייל כבר קיימים' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );
        const userId = result.insertId;

        if (role === 'farmer') {
            await db.query(
                'INSERT INTO farmers (user_id, name, phone, location, dunams, crop_type) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, name, phone, location, dunams || 0, crop_type || '']
            );
        } else if (role === 'volunteer') {
            const gs = parseInt(group_size) || 1;
            await db.query(
                'INSERT INTO volunteers (user_id, name, phone, is_group, group_size) VALUES (?, ?, ?, ?, ?)',
                [userId, name, phone, gs > 1, gs]
            );
        }
        // admin - אין צורך בפרופיל נוסף

        res.status(201).json({ message: 'נרשמת בהצלחה!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בהרשמה' });
    }
};

// התחברות
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(400).json({ error: 'אימייל או סיסמה שגויים' });

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'אימייל או סיסמה שגויים' });

        req.session.userId   = user.id;
        req.session.username = user.username;
        req.session.role     = user.role;

        res.json({ message: 'התחברת בהצלחה', role: user.role, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בהתחברות' });
    }
};

const logout = (req, res) => {
    req.session.destroy(() => res.json({ message: 'התנתקת בהצלחה' }));
};

const status = (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, role: req.session.role, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
};

module.exports = { register, login, logout, status };
