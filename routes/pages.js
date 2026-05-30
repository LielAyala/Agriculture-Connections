const express = require('express');
const router  = express.Router();

// דף הבית
router.get('/', (req, res) => {
    res.render('index', { user: req.session.username || null, role: req.session.role || null });
});

// הרשמה / התחברות
router.get('/register', (req, res) => res.render('register'));
router.get('/login',    (req, res) => res.render('login'));

// דשבורדים
router.get('/farmer-dashboard',       (req, res) => res.render('farmer-dashboard'));
router.get('/volunteer-dashboard',    (req, res) => res.render('volunteer-dashboard'));
router.get('/organization-dashboard', (req, res) => res.render('organization-dashboard'));

// משימות
router.get('/tasks',     (req, res) => res.render('tasks'));
router.get('/tasks/:id', (req, res) => res.render('task-detail', { taskId: req.params.id }));

module.exports = router;
