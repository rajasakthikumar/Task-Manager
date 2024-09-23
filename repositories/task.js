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

    // Find all tasks (for the user who created or is assigned to the task)
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
            status: openStatus._id,  // Store the status reference (_id)
            user: user._id,
            assignedTo: assignedTo ? assignedTo._id : null
        };
    
        // Create the task
        const newTask = await this.model.create(taskToCreate);
    
        // Log the task creation action
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

    // Assign a task to another user (only if the user created the task)
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

    // Update the status of a task (only if the user created the task or is assigned to it)
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

    // Delete task (only if the user created the task or is assigned to it)
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
}

module.exports = TaskRepository;
