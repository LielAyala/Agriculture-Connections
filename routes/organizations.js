const express = require('express');
const router  = express.Router();
const { getReport, getAllTasks, getActiveVolunteers, getFarmersStatus } = require('../controllers/organizationsController');
const { requireRole } = require('../middleware/auth');

router.get('/report',     requireRole('admin'), getReport);
router.get('/tasks',      requireRole('admin'), getAllTasks);
router.get('/volunteers', requireRole('admin'), getActiveVolunteers);
router.get('/farmers',    requireRole('admin'), getFarmersStatus);

module.exports = router;
