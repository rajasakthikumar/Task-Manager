const express = require('express');
const { taskController } = require('../bootstrap');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

console.log('Task router created');

router.get('/', protect, authorize('VIEW_TASKS'), taskController.getAllTasks);
router.get('/assigned', protect, taskController.getTasksAssignedTo);
router.get('/created', protect, taskController.getTasksCreatedBy);
router.get('/deleted', protect, taskController.getDeletedTasks);
router.get('/overdue', protect, taskController.getOverdueTasks);
router.get('/due-today', protect, taskController.getTasksDueToday);
router.get('/priority/:priority', protect, taskController.getTasksByPriority);
router.get('/status/:statusId', protect, taskController.getTasksByStatus);
router.get('/search/:searchTerm', protect, taskController.searchTasks);
router.get('/:id', protect, taskController.getTaskById);

router.post('/', protect, authorize('CREATE_TASK'), taskController.createTask);
router.post('/:id/assign', protect, taskController.assignTask);
router.post('/:id/unassign', protect, taskController.unassignTask);
router.post('/:id/restore', protect, taskController.restoreTask);
router.post('/date-range', protect, taskController.getTasksByDateRange);

router.put('/:id', protect, authorize('UPDATE_TASK'), taskController.updateTask);
router.put('/:id/end-date', protect, taskController.updateTaskEndDate);
router.put('/:id/priority', protect, taskController.updateTaskPriority);
router.put('/:taskId/status/:statusId', protect, taskController.updateTaskStatus);

router.delete('/:id', protect, authorize('DELETE_TASK'), taskController.deleteTask);
router.delete('/:id/soft-delete', protect, taskController.softDeleteTask);

module.exports = router;
