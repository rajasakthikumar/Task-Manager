const BaseRepositoryWithSoftDelete = require('./baseRepositoryWithSoftDelete');
const Task = require('../models/task');
const CustomError = require('../util/customError');

class TaskRepository extends BaseRepositoryWithSoftDelete {
    constructor() {
        super(Task);
    }

    async getAllTasks(userId) {
        return await this.model
            .find({
                $or: [{ user: userId }, { assignedTo: userId }]
            })
            .populate('status comments createdBy');
    }

    async findById(id, userId) {
        const task = await this.model
            .findOne({
                _id: id,
                $or: [{ user: userId }, { assignedTo: userId }]
            })
            .populate('status comments createdBy');

        if (!task) throw new CustomError('Task not found', 404);
        return task;
    }

    async createTask(taskData, user, assignedTo) {
        const taskToCreate = {
            ...taskData,
            user: user._id,
            assignedTo: assignedTo ? assignedTo._id : null,
            createdDate: new Date(),
            status: taskData.status
        };

        const newTask = await this.model.create(taskToCreate);
        return newTask.populate('status');
    }

    async updateTask(id, updatedTask, userId) {
        const task = await this.findById(id, userId);

        task.title = updatedTask.title || task.title;
        task.description = updatedTask.description || task.description;
        task.modifiedDate = new Date();

        return await task.save();
    }

    async updateTaskStatus(taskId, statusId, userId) {
        const task = await this.findById(taskId, userId);

        task.status = statusId;
        task.modifiedDate = new Date();

        return await task.save();
    }

    async assignTask(id, userId, assignedToId) {
        const task = await this.model.findOne({ _id: id, user: userId });
        if (!task) throw new CustomError('Task not found or unauthorized');

        task.assignedTo = assignedToId;
        return await task.save();
    }

    async deleteTask(id, userId) {
        const task = await this.findById(id, userId);
        await task.remove();
        return task;
    }

    async softDeleteTask(id, userId) {
        const task = await this.findById(id, userId);
        task.isDeleted = true;
        task.deletedDate = new Date();
        return await task.save();
    }

    async restoreTask(id, userId) {
        const task = await this.model.findOne({
            _id: id,
            isDeleted: true,
            $or: [{ user: userId }, { assignedTo: userId }]
        });

        if (!task) throw new CustomError('Task not found or unauthorized');

        task.isDeleted = false;
        task.deletedDate = null;

        return await task.save();
    }

    async getDeletedTasks(userId) {
        return await this.model.find({
            isDeleted: true,
            $or: [{ user: userId }, { assignedTo: userId }]
        }).populate('status');
    }

    async getTasksByPriority(userId, priority) {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(priority)) {
            throw new CustomError('Invalid priority value');
        }

        return await this.model
            .find({
                $or: [{ user: userId }, { assignedTo: userId }],
                priority: priority
            })
            .populate('status');
    }

    async updateTaskPriority(id, userId, priority) {
        const task = await this.findById(id, userId);

        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(priority)) {
            throw new CustomError('Invalid priority value');
        }

        task.priority = priority;
        task.modifiedDate = new Date();

        return await task.save();
    }

    async getTasksAssignedTo(userId) {
        return await this.model
            .find({
                assignedTo: userId
            })
            .populate('status');
    }

    async getTasksCreatedBy(userId) {
        return await this.model
            .find({
                user: userId
            })
            .populate('status');
    }

    async getOverdueTasks(userId) {
        const today = new Date();

        return await this.model
            .find({
                $or: [{ user: userId }, { assignedTo: userId }],
                endDate: { $lt: today },
                status: { $ne: 'completed' }
            })
            .populate('status');
    }

    async getTasksDueToday(userId) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        return await this.model
            .find({
                $or: [{ user: userId }, { assignedTo: userId }],
                endDate: { $gte: startOfDay, $lte: endOfDay }
            })
            .populate('status');
    }

    async searchTasks(userId, searchTerm) {
        return await this.model
            .find({
                $or: [{ user: userId }, { assignedTo: userId }],
                $or: [
                    { title: new RegExp(searchTerm, 'i') },
                    { description: new RegExp(searchTerm, 'i') }
                ]
            })
            .populate('status');
    }

    async unassignTask(id, userId) {
        const task = await this.model.findOne({ _id: id, user: userId });
        if (!task) throw new CustomError('Task not found or unauthorized');

        task.assignedTo = null;

        return await task.save();
    }

    async updateTaskEndDate(id, userId, endDate) {
        const task = await this.findById(id, userId);

        task.endDate = endDate;
        task.modifiedDate = new Date();

        return await task.save();
    }
}

module.exports = TaskRepository;
