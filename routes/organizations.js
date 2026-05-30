const express = require('express');
const router  = express.Router();
const { getMyProfile, getReport, getAllTasks } = require('../controllers/organizationsController');
const { requireRole } = require('../middleware/auth');

router.get('/me',     requireRole('organization'), getMyProfile);
router.get('/report', requireRole('organization'), getReport);
router.get('/tasks',  requireRole('organization'), getAllTasks);

module.exports = router;
