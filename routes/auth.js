const express = require('express');
const router  = express.Router();
const { register, login, logout, status } = require('../controllers/authController');

router.post('/register', register);
router.post('/login',    login);
router.post('/logout',   logout);
router.get('/status',    status);

module.exports = router;
