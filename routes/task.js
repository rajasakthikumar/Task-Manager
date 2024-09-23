const express = require('express');
const { taskController } = require('../bootstrap');
const { protect } = require('../middleware/auth');
const router = express.Router();

console.log("Task router created");

// Get all tasks (protected)
router.get('/tasks', protect, (req, res, next) => {
    taskController.getAllTasks(req, res, next);
});

// Get a task by ID (protected)
router.get('/tasks/:id', protect, (req, res, next) => {
    taskController.getTaskById(req, res, next);
});

// Create a new task (protected)
router.post('/tasks', protect, (req, res, next) => {
    taskController.createTask(req, res, next);
});

// Update task details (protected)
router.put('/tasks/:id', protect, (req, res, next) => {
    taskController.updateTask(req, res, next);
});

// Update task status (protected)
router.put('/tasks/:taskId/status/:statusId', protect, (req, res, next) => {
    taskController.updateTaskStatus(req, res, next);
});

// Delete a task by ID (protected)
router.delete('/tasks/:id', protect, (req, res, next) => {
    taskController.deleteTask(req, res, next);
});

// Find tasks by status (protected)
router.get('/tasks/status/:statusId', protect, (req, res, next) => {
    taskController.findTasksByStatus(req, res, next);
});

router.post('/tasks/:taskId/comments', protect, (req, res, next) => {
    taskController.addComment(req, res, next);
});

module.exports = router;
