const BaseService = require('./baseService');
const { sendEmail } = require('./email');
const UserRepository = require('../repositories/user');
const Status = require('../models/status');
const CustomError = require('../util/customError');

class TaskService extends BaseService {
    constructor(repository, commentRepository,userRepository) {
        console.log('Task Service created');
        super(repository);
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    async getAllTasks(user) {
        return await this.repository.getAllTasks(user._id);
    }

    async findById(id, user) {
        return await this.repository.findById(id, user._id);
    }

    async createTask(taskData, user, assignedToId = null) {
        let assignedTo = null;
        if (assignedToId) {
            assignedTo = await this.userRepository.findById(assignedToId);
            if (!assignedTo) {
                throw new CustomError('Assigned user not found');
            }
        }

        const newTask = await this.repository.createTask(
            taskData,
            user,
            assignedTo
        );

        if (assignedTo) {
            await sendEmail(
                assignedTo.email,
                'New Task Assigned',
                `You have been assigned a new task: ${taskData.title}`
            );
        }

        return newTask;
    }

    async updateTask(id, task, user) {
        return await this.repository.updateTask(id, task, user._id);
    }

    async updateTaskStatus(taskId, statusId, user) {
        const updatedTask = await this.repository.updateTaskStatus(
            taskId,
            statusId,
            user._id
        );

        const taskOwner = await this.userRepository.findById(updatedTask.user);
        if (taskOwner) {
            const status = await Status.findById(statusId);
            await sendEmail(
                taskOwner.email,
                'Task Status Updated',
                `The status of your task "${updatedTask.title}" has been updated to "${status.statusName}".`
            );
        }

        return updatedTask;
    }

    async deleteTask(id, user) {
        return await this.repository.deleteTask(id, user._id);
    }

    async assignTask(id, userId, assignedToId) {
        const updatedTask = await this.repository.assignTask(
            id,
            userId,
            assignedToId
        );

        const assignedToUser = await this.userRepository.findById(
            assignedToId
        );
        if (assignedToUser) {
            await sendEmail(
                assignedToUser.email,
                'Task Assigned',
                `You have been assigned a task: ${updatedTask.title}`
            );
        }

        return updatedTask;
    }

    async addComment(taskId, user, commentText) {
        return await this.repository.addComment(taskId, user._id, commentText);
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

    async softDeleteTask(id, user) {
        return await this.repository.softDeleteTask(id, user._id);
    }

    async restoreTask(id, user) {
        return await this.repository.restoreTask(id, user._id);
    }

    async getDeletedTasks(user) {
        return await this.repository.getDeletedTasks(user._id);
    }

    async getTasksByStatus(user, statusId) {
        return await this.repository.getTasksByStatus(user._id, statusId);
    }

    async getTasksByDateRange(user, startDate, endDate) {
        return await this.repository.getTasksByDateRange(
            user._id,
            startDate,
            endDate
        );
    }

    async searchTasks(user, searchTerm) {
        return await this.repository.searchTasks(user._id, searchTerm);
    }

    async getOverdueTasks(user) {
        return await this.repository.getOverdueTasks(user._id);
    }

    async getTasksDueToday(user) {
        return await this.repository.getTasksDueToday(user._id);
    }

    async unassignTask(id, user) {
        return await this.repository.unassignTask(id, user._id);
    }

    async updateTaskEndDate(id, user, endDate) {
        return await this.repository.updateTaskEndDate(
            id,
            user._id,
            endDate
        );
    }
}

module.exports = TaskService;
