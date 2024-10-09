const asyncHandler = require('../middleware/asynchandler');

class TaskController {
    constructor(service) {
        this.service = service;
        console.log("Task Controller created");
    }

    getAllTasks = asyncHandler(async (req, res) => {
        const tasks = await this.service.getAllTasks(req.user);
        res.status(200).json(tasks);
    });

    getTaskById = asyncHandler(async (req, res) => {
        const task = await this.service.findById(
            req.params.id,
            req.user
        );
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

    // Additional methods can be added here if needed
}

module.exports = TaskController;
