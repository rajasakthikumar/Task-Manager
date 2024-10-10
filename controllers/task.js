// controllers/task.js
const asyncHandler = require('../middleware/asynchandler');

class TaskController {
    constructor(service) {
        this.service = service;
        console.log('Task Controller created');
    }

    getAllTasks = asyncHandler(async (req, res) => {
        const tasks = await this.service.getAllTasks(req.user);
        res.status(200).json(tasks);
    });

    getTaskById = asyncHandler(async (req, res) => {
        const task = await this.service.findById(req.params.id, req.user);
        res.status(200).json(task);
    });

    createTask = asyncHandler(async (req, res) => {
        const taskData = { ...req.body };
        const assignedToId = req.body.assignedTo || null;
        const createdTask = await this.service.createTask(
            taskData,
            req.user,
            assignedToId
        );
        res.status(201).json(createdTask);
    });

    updateTask = asyncHandler(async (req, res) => {
        const updatedTask = await this.service.updateTask(
            req.params.id,
            req.body,
            req.user
        );
        res.status(200).json(updatedTask);
    });

    updateTaskStatus = asyncHandler(async (req, res) => {
        const { taskId, statusId } = req.params;
        const updatedTask = await this.service.updateTaskStatus(
            taskId,
            statusId,
            req.user
        );
        res.status(200).json(updatedTask);
    });

    deleteTask = asyncHandler(async (req, res) => {
        const deletedTask = await this.service.deleteTask(
            req.params.id,
            req.user
        );
        res.status(200).json({
            message: 'Task deleted successfully',
            deletedTask
        });
    });

    assignTask = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { assignedToId } = req.body;
        const updatedTask = await this.service.assignTask(
            id,
            req.user._id,
            assignedToId
        );
        res.status(200).json(updatedTask);
    });

    addComment = asyncHandler(async (req, res) => {
        const { taskId } = req.params;
        const { text } = req.body;
        const newComment = await this.service.addComment(
            taskId,
            req.user,
            text
        );
        res.status(201).json(newComment);
    });

    getTasksByPriority = asyncHandler(async (req, res) => {
        const { priority } = req.params;
        const tasks = await this.service.getTasksByPriority(
            req.user,
            priority
        );
        res.status(200).json(tasks);
    });

    updateTaskPriority = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { priority } = req.body;
        const updatedTask = await this.service.updateTaskPriority(
            id,
            req.user,
            priority
        );
        res.status(200).json(updatedTask);
    });

    getTasksAssignedTo = asyncHandler(async (req, res) => {
        const tasks = await this.service.getTasksAssignedTo(req.user);
        res.status(200).json(tasks);
    });

    getTasksCreatedBy = asyncHandler(async (req, res) => {
        const tasks = await this.service.getTasksCreatedBy(req.user);
        res.status(200).json(tasks);
    });

    softDeleteTask = asyncHandler(async (req, res) => {
        const deletedTask = await this.service.softDeleteTask(
            req.params.id,
            req.user
        );
        res.status(200).json({
            message: 'Task soft deleted successfully',
            deletedTask
        });
    });

    restoreTask = asyncHandler(async (req, res) => {
        const restoredTask = await this.service.restoreTask(
            req.params.id,
            req.user
        );
        res.status(200).json({
            message: 'Task restored successfully',
            restoredTask
        });
    });

    getDeletedTasks = asyncHandler(async (req, res) => {
        const tasks = await this.service.getDeletedTasks(req.user);
        res.status(200).json(tasks);
    });

    getTasksByStatus = asyncHandler(async (req, res) => {
        const { statusId } = req.params;
        const tasks = await this.service.getTasksByStatus(
            req.user,
            statusId
        );
        res.status(200).json(tasks);
    });

    getTasksByDateRange = asyncHandler(async (req, res) => {
        const { startDate, endDate } = req.body;
        const tasks = await this.service.getTasksByDateRange(
            req.user,
            startDate,
            endDate
        );
        res.status(200).json(tasks);
    });

    searchTasks = asyncHandler(async (req, res) => {
        const { searchTerm } = req.params;
        const tasks = await this.service.searchTasks(req.user, searchTerm);
        res.status(200).json(tasks);
    });

    getOverdueTasks = asyncHandler(async (req, res) => {
        const tasks = await this.service.getOverdueTasks(req.user);
        res.status(200).json(tasks);
    });

    getTasksDueToday = asyncHandler(async (req, res) => {
        const tasks = await this.service.getTasksDueToday(req.user);
        res.status(200).json(tasks);
    });

    unassignTask = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const updatedTask = await this.service.unassignTask(id, req.user);
        res.status(200).json(updatedTask);
    });

    updateTaskEndDate = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { endDate } = req.body;
        const updatedTask = await this.service.updateTaskEndDate(
            id,
            req.user,
            endDate
        );
        res.status(200).json(updatedTask);
    });
}

module.exports = TaskController;
