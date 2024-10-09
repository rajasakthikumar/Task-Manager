const express = require('express');
const { taskController } = require('../bootstrap');
const { protect, authorize } = require('../middleware/auth');
const { permissionsCheck } = require('../middleware/permissions');
const router = express.Router();

console.log("Task router created");

router.get('/tasks', protect, permissionsCheck(['VIEW_TASKS']), (req, res, next) => {
    taskController.getAllTasks(req, res, next);
});

router.get('/tasks/:id', protect, (req, res, next) => {
    taskController.getTaskById(req, res, next);
});

router.post('/tasks', protect, permissionsCheck(['CREATE_TASK']), (req, res, next) => {
    taskController.createTask(req, res, next);
});

router.put('/tasks/:id', protect, permissionsCheck(['UPDATE_TASK']), (req, res, next) => {
    taskController.updateTask(req, res, next);
});

router.put('/tasks/:taskId/status/:statusId', protect, (req, res, next) => {
    taskController.updateTaskStatus(req, res, next);
});

router.delete('/tasks/:id', protect, permissionsCheck(['DELETE_TASK']), (req, res, next) => {
    taskController.deleteTask(req, res, next);
});

router.post('/tasks/:taskId/comments', protect, (req, res, next) => {
    taskController.addComment(req, res, next);
});

router.post('/tasks/:taskId/comments/:commentId/attachments', protect, (req, res, next) => {
    taskController.addAttachmentsToComment(req, res, next);
});

module.exports = router;
