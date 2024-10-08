// routes/taskRoutes.js
const express = require('express');
const { taskController } = require('../bootstrap');
const { protect } = require('../middleware/auth');
const router = express.Router();

console.log("Task router created");

router.get('/tasks', protect, (req, res, next) => {
    taskController.getAllTasks(req, res, next);
});

router.get('/tasks/:id', protect, (req, res, next) => {
    taskController.getTaskById(req, res, next);
});

router.post('/tasks', protect, (req, res, next) => {
    taskController.createTask(req, res, next);
});

router.put('/tasks/:id', protect, (req, res, next) => {
    console.log(" @!@!@!@! req.body", req.body);
    taskController.updateTask(req, res, next);
});

router.put('/tasks/:taskId/status/:statusId', protect, (req, res, next) => {
    console.log(" @!@!@!@! req.body", req.body);
    taskController.updateTaskStatus(req, res, next);
});

router.delete('/tasks/:id', protect, (req, res, next) => {
    taskController.deleteTask(req, res, next);
});

router.delete('/tasks', protect, (req, res, next) => {
    taskController.deleteTasks(req, res, next);
});

router.post('/tasks/:id/assign', protect, (req, res, next) => {
    taskController.assignTask(req, res, next);
});

router.post('/tasks/:taskId/comments', protect, (req, res, next) => {
    taskController.addComment(req, res, next);
});

router.get('/tasks/priority/:priority', protect, (req, res, next) => {
    taskController.getTasksByPriority(req, res, next);
});

router.put('/tasks/:id/priority', protect, (req, res, next) => {
    taskController.updateTaskPriority(req, res, next);
});

router.get('/tasks/assigned', protect, (req, res, next) => {
    taskController.getTasksAssignedTo(req, res, next);
});

router.get('/tasks/created', protect, (req, res, next) => {
    taskController.getTasksCreatedBy(req, res, next);
});

router.delete('/tasks/:id/soft-delete', protect, (req, res, next) => {
    taskController.softDeleteTask(req, res, next);
});

router.post('/tasks/:id/restore', protect, (req, res, next) => {
    taskController.restoreTask(req, res, next);
});

router.get('/tasks/deleted', protect, (req, res, next) => {
    taskController.getDeletedTasks(req, res, next);
});

router.get('/tasks/status/:statusId', protect, (req, res, next) => {
    taskController.findTasksByStatus(req, res, next);
});

router.get('/tasks/date-range', protect, (req, res, next) => {
    taskController.getTasksByDateRange(req, res, next);
});

router.get('/tasks/search', protect, (req, res, next) => {
    taskController.searchTasks(req, res, next);
});

router.get('/tasks/overdue', protect, (req, res, next) => {
    taskController.getOverdueTasks(req, res, next);
});

router.get('/tasks/due-today', protect, (req, res, next) => {
    taskController.getTasksDueToday(req, res, next);
});

router.put('/tasks/:id/unassign', protect, (req, res, next) => {
    taskController.unassignTask(req, res, next);
});

router.put('/tasks/:id/end-date', protect, (req, res, next) => {
    taskController.updateTaskEndDate(req, res, next);
});

module.exports = router;
