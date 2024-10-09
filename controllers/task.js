const asyncHandler = require('../middleware/asynchandler');

class TaskController {
    constructor(service) {
        this.service = service;
        console.log("Task Controller created");
    }

    getAllTasks = asyncHandler(async (req, res, next) => {
        const tasks = await this.service.getAllTasks(req.user);
        res.status(200).json(tasks);
    });

    getTaskById = asyncHandler(async (req, res, next) => {
        const task = await this.service.findById(req.params.id, req.user);
        res.status(200).json(task);
    });

    createTask = asyncHandler(async (req, res, next) => {
        const taskData = { ...req.body };
        const assignedTo = req.body.assignedTo || null;
        const createdTask = await this.service.createTask(taskData, req.user, assignedTo);
        res.status(201).json(createdTask);
    });

    updateTask = asyncHandler(async (req, res, next) => {
        const updatedTask = await this.service.updateTask(req.params.id, req.body, req.user);
        res.status(200).json(updatedTask);
    });

    updateTaskStatus = asyncHandler(async (req, res, next) => {
        const { taskId, statusId } = req.params;
        const updatedTask = await this.service.updateTaskStatus(taskId, statusId, req.user);
        res.status(200).json(updatedTask);
    });

    deleteTask = asyncHandler(async (req, res, next) => {
        const deletedTask = await this.service.deleteTask(req.params.id, req.user);
        res.status(200).json({ message: 'Task deleted successfully', deletedTask });
    });

    deleteTasks = asyncHandler(async (req, res, next) => {
        await this.service.deleteAllTasks(req.user);
        res.status(200).json({
            message: 'All tasks are cleared',
        });
    });

    assignTask = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { assignedToId } = req.body;

        const updatedTask = await this.service.assignTask(id, req.user._id, assignedToId);
        res.status(200).json(updatedTask);
    });

    addComment = asyncHandler(async (req, res, next) => {
        const { taskId } = req.params;
        const { text } = req.body;

        const newComment = await this.service.addComment(taskId, req.user, text);

        res.status(201).json(newComment);
    });

    getTasksByPriority = asyncHandler(async (req, res, next) => {
        const { priority } = req.params;
        const tasks = await this.service.getTasksByPriority(req.user, priority);
        res.status(200).json(tasks);
    });

    updateTaskPriority = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const { priority } = req.body;
        const updatedTask = await this.service.updateTaskPriority(id, req.user, priority);
        res.status(200).json(updatedTask);
    });

    getTasksAssignedTo = asyncHandler(async (req, res, next) => {
        const tasks = await this.service.getTasksAssignedTo(req.user);
        res.status(200).json(tasks);
    });

    getTasksCreatedBy = asyncHandler(async (req, res, next) => {
        const tasks = await this.service.getTasksCreatedBy(req.user);
        res.status(200).json(tasks);
    });

    softDeleteTask = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const softDeletedTask = await this.service.softDeleteTask(id, req.user);
        res.status(200).json({ message: 'Task soft deleted successfully', softDeletedTask });
    });

    restoreTask = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const restoredTask = await this.service.restoreTask(id, req.user);
        res.status(200).json({ message: 'Task restored successfully', restoredTask });
    });

    getDeletedTasks = asyncHandler(async (req, res, next) => {
        const tasks = await this.service.getDeletedTasks(req.user);
        res.status(200).json(tasks);
    });

    getTasksByDateRange = asyncHandler(async (req, res, next) => {
        const { startDate, endDate } = req.query;
        const tasks = await this.service.getTasksByDateRange(req.user, new Date(startDate), new Date(endDate));
        res.status(200).json(tasks);
    });

    searchTasks = asyncHandler(async (req, res, next) => {
        const { searchTerm } = req.query;
        const tasks = await this.service.searchTasks(req.user, searchTerm);
        res.status(200).json(tasks);
    });

    getOverdueTasks = asyncHandler(async (req, res, next) => {
        const tasks = await this.service.getOverdueTasks(req.user);
        res.status(200).json(tasks);
    });

    getTasksDueToday = asyncHandler(async (req, res, next) => {
        const tasks = await this.service.getTasksDueToday(req.user);
        res.status(200).json(tasks);
    });

    unassignTask = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const updatedTask = await this.service.unassignTask(id, req.user);
        res.status(200).json(updatedTask);
    });

    updateTaskEndDate = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const { endDate } = req.body;
        const updatedTask = await this.service.updateTaskEndDate(id, req.user, new Date(endDate));
        res.status(200).json(updatedTask);
    });

    addComment = asyncHandler(async (req, res) => {
        const { taskId } = req.params;
        const { text } = req.body;
        const newComment = await this.service.addComment(taskId, req.user._id, text);
        res.status(201).json(newComment);
    });

    softDeleteTask = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const deletedTask = await this.service.softDeleteTask(id);
        res.status(200).json({ message: 'Task soft deleted successfully', deletedTask });
    });

    restoreTask = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const restoredTask = await this.service.restoreTask(id);
        res.status(200).json({ message: 'Task restored successfully', restoredTask });
    });

    getTasksWithFilter = asyncHandler(async (req, res) => {
        const { page, limit, status, priority } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const tasks = await this.service.getTasksWithFilter(filter, parseInt(page), parseInt(limit));
        res.status(200).json(tasks);
    });

    addComment = asyncHandler(async (req, res) => {
        const { taskId } = req.params;
        const { text } = req.body;
        const newComment = await this.service.addComment(taskId, req.user._id, text);
        res.status(201).json(newComment);
    });

    

}

module.exports = TaskController;
