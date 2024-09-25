const BaseRepositorySoftDelete = require('./baseRepositoryWithSoftDelete');
const Task = require('../models/task');
const Status = require('../models/status');
const Comment = require('../models/comment'); 
const Log = require('../models/log');

class TaskRepository extends BaseRepositorySoftDelete {
    constructor() {
        console.log("Task Repository created");
        super(Task);
    }

    async getAllTasks(userId) {
        return await this.model.find({
            $or: [{ user: userId }, { assignedTo: userId }]
        }).populate('status');
    }

    async findById(id, userId) {
        const task = await this.model.findOne({
            _id: id,
            $or: [{ user: userId }, { assignedTo: userId }]
        }).populate('status');

        if (!task) throw new Error('Task not found or unauthorized');
        return task;
    }

    async createTask(task, user, assignedTo = null) {
        const openStatus = await Status.findOne({ _id: task.status });
        if (!openStatus){ 
            console.log(`${task.status} status id`);
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
    
        await Log.create({
            action: 'Task Created',
            user: user._id,
            task: newTask._id,
            assignedTo: assignedTo ? assignedTo._id : null
        });
    
        // Populate the status field before returning the task
        const populatedTask = await this.model.findById(newTask._id).populate('status');
    
        return populatedTask;
    }
    
    async updateTask(id, updatedTask, userId) {
        const task = await this.findById(id, userId);

        // Only the creator or assigned user can update the task
        if (task.user.toString() !== userId.toString() && task.assignedTo.toString() !== userId.toString()) {
            throw new Error('Only the creator or assigned user can update this task');
        }

        task.title = updatedTask.title || task.title;
        task.description = updatedTask.description || task.description;
        task.modifiedDate = new Date();

        await Log.create({
            action: 'Task Updated',
            user: userId,
            task: task._id
        });

        return await task.save();
    }

    async assignTask(id, userId, assignedToId) {
        const task = await this.model.findOne({ _id: id, user: userId });
        if (!task) throw new Error('Task not found or unauthorized');

        task.assignedTo = assignedToId;

        await Log.create({
            action: 'Task Assigned',
            user: userId,
            task: task._id,
            assignedTo: assignedToId
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

        await Log.create({
            action: 'Task Status Updated',
            user: userId,
            task: task._id,
            newStatus: status._id
        });

        return await task.save();
    }

    async deleteTask(id, userId) {
        const task = await this.findById(id, userId);

        await Log.create({
            action: 'Task Deleted',
            user: userId,
            task: task._id
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

        await Log.create({
            action: 'Task Priority Updated',
            user: userId,
            task: task._id,
            newPriority: priority
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

        await Log.create({
            action: 'Task Soft Deleted',
            user: userId,
            task: task._id
        });

        return await task.save();
    }

    // Restore a soft-deleted task (only if the user created the task or is assigned to it)
    async restoreTask(id, userId) {
        const task = await this.model.findOne({
            _id: id,
            isDeleted: true,
            $or: [{ user: userId }, { assignedTo: userId }]
        });

        if (!task) throw new Error('Task not found or unauthorized');

        task.isDeleted = false;
        task.deletedDate = null;

        await Log.create({
            action: 'Task Restored',
            user: userId,
            task: task._id
        });

        return await task.save();
    }

    // Get all soft-deleted tasks for a user
    async getDeletedTasks(userId) {
        return await this.model.find({
            isDeleted: true,
            $or: [{ user: userId }, { assignedTo: userId }]
        }).populate('status');
    }

    // Get tasks by status
    async getTasksByStatus(userId, statusId) {
        return await this.model.find({
            $or: [{ user: userId }, { assignedTo: userId }],
            status: statusId
        }).populate('status');
    }

    // Get tasks within a date range
    async getTasksByDateRange(userId, startDate, endDate) {
        const query = {
            $or: [{ user: userId }, { assignedTo: userId }],
            createdDate: { $gte: startDate, $lte: endDate }
        };

        return await this.model.find(query).populate('status');
    }

    // Search tasks by a term in title or description
    async searchTasks(userId, searchTerm) {
        return await this.model.find({
            $or: [{ user: userId }, { assignedTo: userId }],
            $or: [
                { title: new RegExp(searchTerm, 'i') },
                { description: new RegExp(searchTerm, 'i') }
            ]
        }).populate('status');
    }

    // Get overdue tasks (tasks past endDate and not completed)
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

    // Get tasks due today
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

    // Remove assignment from a task (only if the user created the task)
    async unassignTask(id, userId) {
        const task = await this.model.findOne({ _id: id, user: userId });
        if (!task) throw new Error('Task not found or unauthorized');

        task.assignedTo = null;

        await Log.create({
            action: 'Task Unassigned',
            user: userId,
            task: task._id
        });

        return await task.save();
    }

    // Update end date of a task (only if the user created the task or is assigned to it)
    async updateTaskEndDate(id, userId, endDate) {
        const task = await this.findById(id, userId);

        task.endDate = endDate;
        task.modifiedDate = new Date();

        await Log.create({
            action: 'Task End Date Updated',
            user: userId,
            task: task._id,
            newEndDate: endDate
        });

        return await task.save();
    }
}

module.exports = TaskRepository;
