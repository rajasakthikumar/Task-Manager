const BaseService = require('./baseService');
const { sendEmail } = require('./email');
const CustomError = require('../util/customError');

class TaskService extends BaseService {
    constructor(taskRepository, commentRepository, userRepository, statusRepository, auditLogRepository) {
        super(taskRepository);
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.statusRepository = statusRepository;
        this.auditLogRepository = auditLogRepository;
    }

    async getAllTasks(user) {
        return await this.repository.getAllTasks(user._id);
    }

    async findById(id, user) {
        const task = await this.repository.findById(id, user._id);
        if (!task) throw new CustomError('Task not found or unauthorized', 404);
        return task;
    }

    async createTask(taskData, user, assignedToId = null) {
        let assignedTo = null;
        if (assignedToId) {
            assignedTo = await this.userRepository.findById(assignedToId);
            if (!assignedTo) throw new CustomError('Assigned user not found', 404);
        }

        const newTask = await this.repository.createTask(taskData, user, assignedTo);

        if (assignedTo && assignedTo.email) {
            await sendEmail(assignedTo.email, 'New Task Assigned', `You have been assigned a new task: ${taskData.title}`);
        }

        return newTask;
    }

    async updateTask(id, taskData, user) {
        return await this.repository.updateTask(id, taskData, user._id);
    }

    async updateTaskStatus(taskId, statusId, user) {
        const status = await this.statusRepository.findById(statusId);
        if (!status) throw new CustomError('Invalid status', 400);

        const task = await this.repository.updateTaskStatus(taskId, statusId, user._id);

        const taskOwner = await this.userRepository.findById(task.user);
        if (taskOwner && taskOwner.email) {
            await sendEmail(taskOwner.email, 'Task Status Updated', `Your task "${task.title}" status has been updated to "${status.statusName}".`);
        }

        return task;
    }

    async deleteTask(id, user) {
        return await this.repository.deleteTask(id, user._id);
    }

    async assignTask(id, userId, assignedToId) {
        const task = await this.repository.assignTask(id, userId, assignedToId);

        const assignedToUser = await this.userRepository.findById(assignedToId);
        if (assignedToUser && assignedToUser.email) {
            await sendEmail(assignedToUser.email, 'Task Assigned', `You have been assigned a task: ${task.title}`);
        }

        return task;
    }

    async softDeleteTask(id, user) {
        return await this.repository.softDeleteTask(id, user._id);
    }

    async restoreTask(id, user) {
        return await this.repository.restoreTask(id, user._id);
    }

    async getDeletedTasks(user) {
        return await this.repository.getDeletedTasks(user._id);
    }

    async getTasksByPriority(user, priority) {
        return await this.repository.getTasksByPriority(user._id, priority);
    }

    async updateTaskPriority(id, user, priority) {
        return await this.repository.updateTaskPriority(id, user._id, priority);
    }

    async getTasksAssignedTo(user) {
        return await this.repository.getTasksAssignedTo(user._id);
    }

    async getTasksCreatedBy(user) {
        return await this.repository.getTasksCreatedBy(user._id);
    }

    async getOverdueTasks(user) {
        return await this.repository.getOverdueTasks(user._id);
    }

    async getTasksDueToday(user) {
        return await this.repository.getTasksDueToday(user._id);
    }

    async searchTasks(user, searchTerm) {
        return await this.repository.searchTasks(user._id, searchTerm);
    }

    async unassignTask(id, user) {
        return await this.repository.unassignTask(id, user._id);
    }

    async updateTaskEndDate(id, user, endDate) {
        return await this.repository.updateTaskEndDate(id, user._id, endDate);
    }
}

module.exports = TaskService;
