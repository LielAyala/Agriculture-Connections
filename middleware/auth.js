// בדיקה שהמשתמש מחובר
const isLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'יש להתחבר תחילה' });
    }
    next();
};

// בדיקת תפקיד
const requireRole = (...roles) => (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'יש להתחבר תחילה' });
    }
    if (!roles.includes(req.session.role)) {
        return res.status(403).json({ error: 'אין לך הרשאה לפעולה זו' });
    }
    next();
};

module.exports = { isLoggedIn, requireRole };
