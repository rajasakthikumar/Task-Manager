const asyncHandler = require('../middleware/asynchandler');

class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }

    getAllTasks = asyncHandler(async (req, res) => {
        const tasks = await this.taskService.getAllTasks(req.user);
        res.status(200).json(tasks);
    });

    getTaskById = asyncHandler(async (req, res) => {
        const task = await this.taskService.findById(req.params.id, req.user);
        res.status(200).json(task);
    });

    createTask = asyncHandler(async (req, res) => {
        const { assignedTo, ...taskData } = req.body;
        const createdTask = await this.taskService.createTask(taskData, req.user, assignedTo);
        res.status(201).json(createdTask);
    });

    updateTask = asyncHandler(async (req, res) => {
        const updatedTask = await this.taskService.updateTask(req.params.id, req.body, req.user);
        res.status(200).json(updatedTask);
    });

    updateTaskStatus = asyncHandler(async (req, res) => {
        const updatedTask = await this.taskService.updateTaskStatus(req.params.taskId, req.params.statusId, req.user);
        res.status(200).json(updatedTask);
    });

    deleteTask = asyncHandler(async (req, res) => {
        const deletedTask = await this.taskService.deleteTask(req.params.id, req.user);
        res.status(200).json({
            message: 'Task deleted successfully',
            deletedTask
        });
    });

    assignTask = asyncHandler(async (req, res) => {
        const { assignedToId } = req.body;
        const updatedTask = await this.taskService.assignTask(req.params.id, req.user._id, assignedToId);
        res.status(200).json(updatedTask);
    });

    softDeleteTask = asyncHandler(async (req, res) => {
        const deletedTask = await this.taskService.softDeleteTask(req.params.id, req.user);
        res.status(200).json({
            message: 'Task soft deleted successfully',
            deletedTask
        });
    });

    restoreTask = asyncHandler(async (req, res) => {
        const restoredTask = await this.taskService.restoreTask(req.params.id, req.user);
        res.status(200).json({
            message: 'Task restored successfully',
            restoredTask
        });
    });

    getDeletedTasks = asyncHandler(async (req, res) => {
        const tasks = await this.taskService.getDeletedTasks(req.user);
        res.status(200).json(tasks);
    });

    getTasksByPriority = asyncHandler(async (req, res) => {
        const { priority } = req.params;
        const tasks = await this.taskService.getTasksByPriority(req.user, priority);
        res.status(200).json(tasks);
    });

    updateTaskPriority = asyncHandler(async (req, res) => {
        const { priority } = req.body;
        const updatedTask = await this.taskService.updateTaskPriority(req.params.id, req.user, priority);
        res.status(200).json(updatedTask);
    });

    getTasksAssignedTo = asyncHandler(async (req, res) => {
        const tasks = await this.taskService.getTasksAssignedTo(req.user);
        res.status(200).json(tasks);
    });

    getTasksCreatedBy = asyncHandler(async (req, res) => {
        const tasks = await this.taskService.getTasksCreatedBy(req.user);
        res.status(200).json(tasks);
    });

    getOverdueTasks = asyncHandler(async (req, res) => {
        const tasks = await this.taskService.getOverdueTasks(req.user);
        res.status(200).json(tasks);
    });

    getTasksDueToday = asyncHandler(async (req, res) => {
        const tasks = await this.taskService.getTasksDueToday(req.user);
        res.status(200).json(tasks);
    });

    searchTasks = asyncHandler(async (req, res) => {
        const { searchTerm } = req.params;
        const tasks = await this.taskService.searchTasks(req.user, searchTerm);
        res.status(200).json(tasks);
    });

    unassignTask = asyncHandler(async (req, res) => {
        const updatedTask = await this.taskService.unassignTask(req.params.id, req.user);
        res.status(200).json(updatedTask);
    });

    updateTaskEndDate = asyncHandler(async (req, res) => {
        const { endDate } = req.body;
        const updatedTask = await this.taskService.updateTaskEndDate(req.params.id, req.user, endDate);
        res.status(200).json(updatedTask);
    });
}

module.exports = TaskController;
