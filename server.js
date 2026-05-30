const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'agri_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // יום אחד
}));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routers - דפי EJS
app.use('/', require('./routes/pages'));

// Routers - API
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/tasks',         require('./routes/tasks'));
app.use('/api/farmers',       require('./routes/farmers'));
app.use('/api/volunteers',    require('./routes/volunteers'));
app.use('/api/organizations', require('./routes/organizations'));

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'שגיאת שרת פנימית' });
});

app.listen(PORT, () => {
    console.log(`השרת פועל על פורט ${PORT}`);
});
