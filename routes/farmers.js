const express = require('express');
const router  = express.Router();
const { getMyProfile, updateMyProfile, getMyTasks } = require('../controllers/farmersController');
const { requireRole } = require('../middleware/auth');

router.get('/me',        requireRole('farmer'), getMyProfile);
router.put('/me',        requireRole('farmer'), updateMyProfile);
router.get('/me/tasks',  requireRole('farmer'), getMyTasks);

module.exports = router;
