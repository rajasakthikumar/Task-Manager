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
        const createdTask = await this.service.createTask(taskData, req.user);
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

    findTasksByStatus = asyncHandler(async (req, res, next) => {
        const tasks = await this.service.findTasksByStatus(req.params.statusId, req.user);
        res.status(200).json(tasks);
    });

    deleteTasks = asyncHandler(async (req, res, next) => {
        await this.service.deleteAllTasks(req.user);
        res.status(200).json({
            message: 'All tasks are cleared by admin',
        });
    });

    assignTask = asyncHandler(async (req, res, next) => {
        const { id, assignedToId } = req.params;
        const assignedTask = await this.service.assignTask(id, req.user, assignedToId);
        res.status(200).json(assignedTask);
    });

    addComment = asyncHandler(async (req, res, next) => {
        const { taskId } = req.params;
        const { commentText } = req.body;

        // Ensure the user is either the creator or assigned to the task
        const newComment = await this.service.addComment(taskId, req.user._id, commentText);

        res.status(201).json(newComment);
    });

}

module.exports = TaskController;
