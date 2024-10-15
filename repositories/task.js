const BaseRepositoryWithSoftDelete = require('./baseRepositoryWithSoftDelete');
const Task = require('../models/task');
const Status = require('../models/status');
const Comment = require('../models/comment');
const AuditLog = require('../models/auditLog');
const CustomError = require('../util/customError');
const User = require('../models/user');

class TaskRepository extends BaseRepositoryWithSoftDelete {
    constructor() {
        console.log("Task Repository created");
        super(Task);
    }

    async getAllTasks(userId) {
        try {
            const tasks = await this.model
                .find({
                    $or: [{ user: userId }, { assignedTo: userId }]
                })
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'createdBy',
                        model: 'User',
                        select: 'username roles'
                    }
                })
                .populate('status');

            if (!tasks || tasks.length === 0)
                throw new CustomError('Tasks not found or unauthorized');
            return tasks;
        } catch (error) {
            throw new CustomError(`Error fetching tasks: ${error.message}`);
        }
    }

    async findById(id, userId) {
        const task = await this.model
            .findOne({
                _id: id,
                $or: [{ user: userId }, { assignedTo: userId }]
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'createdBy',
                    model: 'User',
                    select: 'username roles'
                }
            })
            .populate('status');

        console.log(`@!@!@!@! this is task ${task}`);

        if (!task) throw new CustomError('Task not found or unauthorized');
        return task;
    }

    async createTask(taskData, user, assignedTo = null) {
        const openStatus = await Status.findOne({ _id: taskData.status });
        if (!openStatus) {
            throw new CustomError('Open status not found');
        }
    
        console.log('@!@!@!@! openStatus ', openStatus);
        console.log('@!@!@!@!@!@! TaskRepository');
    
        const taskToCreate = {
            ...taskData,
            status: openStatus._id,  // Corrected from 'status._id' to 'openStatus._id'
            user: user._id,
            assignedTo: assignedTo ? assignedTo._id : null,
            createdDate: new Date()
        };
    
        console.log('@!@!@!@! taskToCreate ', taskToCreate);
    
        const newTask = await this.model.create(taskToCreate);
        console.log('@!@!@!@! newTask ', newTask);
    
        await AuditLog.create({
            action: 'Task Created',
            performedBy: user._id,
            entity: 'Task',
            entityId: newTask._id,
            changes: taskData
        });
    
        const populatedTask = await this.model
            .findById(newTask._id)
            .populate('status');
    
        return populatedTask;
    }
    
    async updateTask(id, updatedTask, userId) {
        const task = await this.findById(id, userId);

        if (
            task.user.toString() !== userId.toString() &&
            task.assignedTo.toString() !== userId.toString()
        ) {
            throw new CustomError(
                'Only the creator or assigned user can update this task'
            );
        }

        task.title = updatedTask.title || task.title;
        task.description = updatedTask.description || task.description;
        task.modifiedDate = new Date();

        await AuditLog.create({
            action: 'Task Updated',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id,
            changes: updatedTask
        });

        return await task.save();
    }

    async updateTaskStatus(taskId, statusId, userId) {
        const task = await this.findById(taskId, userId);

        const status = await Status.findById(statusId);
        if (!status) throw new CustomError('Status not found');

        if (!(await this.validateStatusTransition(task.status, statusId))) {
            throw new CustomError('Invalid status transition');
        }

        task.status = status._id;
        task.modifiedDate = new Date();

        if (status.statusName.toLowerCase() === 'completed') {
            task.endDate = new Date();
        }

        await AuditLog.create({
            action: 'Task Status Updated',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id,
            changes: { status: status._id }
        });

        return await task.save();
    }

    async validateStatusTransition(currentStatusId, nextStatusId) {
        const currentStatus = await Status.findById(currentStatusId);
        if (!currentStatus) throw new CustomError('Current status not found');

        const isValidTransition = currentStatus.nextStatuses.includes(
            nextStatusId
        );
        return isValidTransition;
    }

    async assignTask(id, userId, assignedToId) {
        const task = await this.model.findOne({ _id: id, user: userId });
        if (!task) throw new CustomError('Task not found or unauthorized');

        task.assignedTo = assignedToId;

        await AuditLog.create({
            action: 'Task Assigned',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id,
            changes: { assignedTo: assignedToId }
        });

        return await task.save();
    }

    async deleteTask(id, userId) {
        const task = await this.findById(id, userId);

        await AuditLog.create({
            action: 'Task Deleted',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id
        });

        return await this.model.findByIdAndDelete(id);
    }

    async softDeleteTask(id, userId) {
        const task = await this.findById(id, userId);

        task.isDeleted = true;
        task.deletedDate = new Date();

        await AuditLog.create({
            action: 'Task Soft Deleted',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id
        });

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

        await AuditLog.create({
            action: 'Task Restored',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id
        });

        return await task.save();
    }

    async addComment(taskId, userId, commentText) {
        const task = await this.model.findById(taskId);

        if (!task) {
            throw new CustomError('Task not found');
        }

        if (
            task.user.toString() !== userId.toString() &&
            task.assignedTo.toString() !== userId.toString()
        ) {
            throw new CustomError(
                'Only the creator or assigned user can comment on this task'
            );
        }

        const newComment = await Comment.create({
            text: commentText,
            createdBy: userId,
            task: taskId
        });

        task.comments.push(newComment._id);
        await task.save();

        await AuditLog.create({
            action: 'Comment Added',
            performedBy: userId,
            entity: 'Comment',
            entityId: newComment._id,
            changes: { text: commentText, taskId }
        });

        return newComment;
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

        await AuditLog.create({
            action: 'Task Priority Updated',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id,
            changes: { priority: priority }
        });

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

    async getDeletedTasks(userId) {
        return await this.model
            .find({
                isDeleted: true,
                $or: [{ user: userId }, { assignedTo: userId }]
            })
            .populate('status');
    }

    async getTasksByStatus(userId, statusId) {
        return await this.model
            .find({
                $or: [{ user: userId }, { assignedTo: userId }],
                status: statusId
            })
            .populate('status');
    }

    async getTasksByDateRange(userId, startDate, endDate) {
        const query = {
            $or: [{ user: userId }, { assignedTo: userId }],
            createdDate: { $gte: startDate, $lte: endDate }
        };

        return await this.model.find(query).populate('status');
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

    async getOverdueTasks(userId) {
        const today = new Date();

        const completedStatus = await Status.findOne({
            statusName: 'completed'
        });

        if (!completedStatus) throw new CustomError('Completed status not found');

        return await this.model
            .find({
                $or: [{ user: userId }, { assignedTo: userId }],
                endDate: { $lt: today },
                status: { $ne: completedStatus._id }
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

    async unassignTask(id, userId) {
        const task = await this.model.findOne({ _id: id, user: userId });
        if (!task) throw new CustomError('Task not found or unauthorized');

        task.assignedTo = null;

        await AuditLog.create({
            action: 'Task Unassigned',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id
        });

        return await task.save();
    }

    async updateTaskEndDate(id, userId, endDate) {
        const task = await this.findById(id, userId);

        task.endDate = endDate;
        task.modifiedDate = new Date();

        await AuditLog.create({
            action: 'Task End Date Updated',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id,
            changes: { endDate: endDate }
        });

        return await task.save();
    }
}

module.exports = TaskRepository;
