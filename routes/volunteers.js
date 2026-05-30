const express = require('express');
const router  = express.Router();
const { getMyProfile, updateMyProfile, getMyTasks } = require('../controllers/volunteersController');
const { requireRole } = require('../middleware/auth');

router.get('/me',       requireRole('volunteer'), getMyProfile);
router.put('/me',       requireRole('volunteer'), updateMyProfile);
router.get('/me/tasks', requireRole('volunteer'), getMyTasks);

module.exports = router;
