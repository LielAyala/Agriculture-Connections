const express = require('express');
const router  = express.Router();
const { getAllTasks, getTaskById, createTask, assignTask, completeTask, cancelTask } = require('../controllers/tasksController');
const { isLoggedIn, requireRole } = require('../middleware/auth');

router.get('/',              isLoggedIn,                  getAllTasks);
router.get('/:id',           isLoggedIn,                  getTaskById);
router.post('/',             requireRole('farmer'),        createTask);
router.put('/:id/assign',    requireRole('volunteer'),     assignTask);
router.put('/:id/complete',  requireRole('farmer'),        completeTask);
router.delete('/:id',        requireRole('farmer'),        cancelTask);

module.exports = router;
