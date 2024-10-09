// repositories/taskRepository.js
const BaseRepositoryWithSoftDelete = require('./baseRepositoryWithSoftDelete');
const Task = require('../models/task');
const Status = require('../models/status');
const Comment = require('../models/comment');
const AuditLog = require('../models/auditLog');
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

            console.log(`@!@!@!@! this is task ${tasks}`);
            if (!tasks || tasks.length === 0) throw new Error('Tasks not found or unauthorized');
            return tasks;
        } catch (error) {
            throw new Error(`Error fetching tasks: ${error.message}`);
        }
    }

    async findById(id, userId) {
        const task = await this.model.findOne({
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

        if (!task) throw new Error('Task not found or unauthorized');
        return task;
    }

    async createTask(task, user, assignedTo = null) {
        const openStatus = await Status.findOne({ _id: task.status });
        if (!openStatus) {
            throw new Error('Open status not found');
        }

        const taskToCreate = {
            ...task,
            status: openStatus._id,
            user: user._id,
            assignedTo: assignedTo ? assignedTo._id : null
        };

        // Create the task
        const newTask = await this.model.create(taskToCreate);

        // Create audit log
        await AuditLog.create({
            action: 'Task Created',
            performedBy: user._id,
            entity: 'Task',
            entityId: newTask._id,
            changes: { taskData: task, assignedTo: assignedTo ? assignedTo._id : null }
        });

        // Populate the status field before returning the task
        const populatedTask = await this.model.findById(newTask._id).populate('status');

        return populatedTask;
    }

    async updateTask(id, updatedTask, userId) {
        const task = await this.findById(id, userId);
        console.log('@!@!@!@! Reached here');

        // Only the creator or assigned user can update the task
        if (task.user.toString() !== userId.toString() && task.assignedTo.toString() !== userId.toString()) {
            throw new Error('Only the creator or assigned user can update this task');
        }

        task.title = updatedTask.title || task.title;
        task.description = updatedTask.description || task.description;
        task.modifiedDate = new Date();

        // Create audit log
        await AuditLog.create({
            action: 'Task Updated',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id,
            changes: { title: task.title, description: task.description }
        });

        return await task.save();
    }

    async assignTask(id, userId, assignedToId) {
        const task = await this.model.findOne({ _id: id, user: userId });
        if (!task) throw new Error('Task not found or unauthorized');

        task.assignedTo = assignedToId;

        // Create audit log
        await AuditLog.create({
            action: 'Task Assigned',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id,
            changes: { assignedTo: assignedToId }
        });

        return await task.save();
    }

    async updateTaskStatus(taskId, statusId, userId) {
        const task = await this.findById(taskId, userId);

        const status = await Status.findById(statusId);
        if (!status) throw new Error('Status not found');

        task.status = status._id;
        task.modifiedDate = new Date();

        if (status.statusName === 'completed') {
            task.endDate = new Date();
        }

        // Create audit log
        await AuditLog.create({
            action: 'Task Status Updated',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id,
            changes: { status: status._id }
        });

        return await task.save();
    }

    async deleteTask(id, userId) {
        const task = await this.findById(id, userId);

        // Create audit log
        await AuditLog.create({
            action: 'Task Deleted',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id
        });

        return await this.model.findByIdAndDelete(id);
    }

    async addComment(taskId, userId, commentText) {
        const task = await this.model.findById(taskId);

        if (!task) {
            throw new Error('Task not found');
        }

        if (task.user.toString() !== userId.toString() && task.assignedTo.toString() !== userId.toString()) {
            throw new Error('Only the creator or assigned user can comment on this task');
        }

        const newComment = await Comment.create({
            text: commentText,
            createdBy: userId,
            task: taskId
        });

        task.comments.push(newComment._id);
        await task.save();

        // Create audit log
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
            throw new Error('Invalid priority value');
        }

        return await this.model.find({
            $or: [{ user: userId }, { assignedTo: userId }],
            priority: priority
        }).populate('status');
    }

    async updateTaskPriority(id, userId, priority) {
        const task = await this.findById(id, userId);

        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(priority)) {
            throw new Error('Invalid priority value');
        }

        task.priority = priority;
        task.modifiedDate = new Date();

        // Create audit log
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
        return await this.model.find({
            assignedTo: userId
        }).populate('status');
    }

    async getTasksCreatedBy(userId) {
        return await this.model.find({
            user: userId
        }).populate('status');
    }

    async softDeleteTask(id, userId) {
        const task = await this.findById(id, userId);

        task.isDeleted = true;
        task.deletedDate = new Date();

        // Create audit log
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

        if (!task) throw new Error('Task not found or unauthorized');

        task.isDeleted = false;
        task.deletedDate = null;

        // Create audit log
        await AuditLog.create({
            action: 'Task Restored',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id
        });

        return await task.save();
    }

    async getDeletedTasks(userId) {
        return await this.model.find({
            isDeleted: true,
            $or: [{ user: userId }, { assignedTo: userId }]
        }).populate('status');
    }

    async getTasksByStatus(userId, statusId) {
        return await this.model.find({
            $or: [{ user: userId }, { assignedTo: userId }],
            status: statusId
        }).populate('status');
    }

    async getTasksByDateRange(userId, startDate, endDate) {
        const query = {
            $or: [{ user: userId }, { assignedTo: userId }],
            createdDate: { $gte: startDate, $lte: endDate }
        };

        return await this.model.find(query).populate('status');
    }

    async searchTasks(userId, searchTerm) {
        return await this.model.find({
            $or: [{ user: userId }, { assignedTo: userId }],
            $or: [
                { title: new RegExp(searchTerm, 'i') },
                { description: new RegExp(searchTerm, 'i') }
            ]
        }).populate('status');
    }

    async getOverdueTasks(userId) {
        const today = new Date();

        // Get the 'completed' status id
        const completedStatus = await Status.findOne({ statusName: 'completed' });

        if (!completedStatus) throw new Error('Completed status not found');

        return await this.model.find({
            $or: [{ user: userId }, { assignedTo: userId }],
            endDate: { $lt: today },
            status: { $ne: completedStatus._id }
        }).populate('status');
    }

    async getTasksDueToday(userId) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        return await this.model.find({
            $or: [{ user: userId }, { assignedTo: userId }],
            endDate: { $gte: startOfDay, $lte: endOfDay }
        }).populate('status');
    }

    async unassignTask(id, userId) {
        const task = await this.model.findOne({ _id: id, user: userId });
        if (!task) throw new Error('Task not found or unauthorized');

        task.assignedTo = null;

        // Create audit log
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

        // Create audit log
        await AuditLog.create({
            action: 'Task End Date Updated',
            performedBy: userId,
            entity: 'Task',
            entityId: task._id,
            changes: { endDate: endDate }
        });

        return await task.save();
    }

    async softDelete(id) {
        const task = await this.findById(id);
        if (!task) throw new Error('Task not found');
        
        task.isDeleted = true;
        task.deletedAt = new Date();
        return await task.save();
    }

    async restore(id) {
        const task = await this.model.findOne({ _id: id, isDeleted: true });
        if (!task) throw new Error('Task not found or already restored');

        task.isDeleted = false;
        task.deletedAt = null;
        return await task.save();
    }
}

module.exports = TaskRepository;
