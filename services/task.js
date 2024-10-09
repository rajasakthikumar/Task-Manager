const BaseService = require('./baseService');

class TaskService extends BaseService {
    constructor(repository, commentRepository) {
        console.log("Task Service created");
        super(repository);
        this.commentRepository = commentRepository;
    }

    getAllTasks(user) {
        return this.repository.getAllTasks(user._id);
    }

    findById(id, user) {
        return this.repository.findById(id, user._id);
    }

    async createTask(taskData, user, assignedTo = null) {
        const task = await this.repository.createTask(taskData, user, assignedTo);
        return task;
    }

    updateTask(id, task, user) {
        return this.repository.updateTask(id, task, user._id);
    }

    updateTaskStatus(taskId, statusId, user) {
        return this.repository.updateTaskStatus(taskId, statusId, user._id);
    }

    deleteTask(id, user) {
        return this.repository.deleteTask(id, user._id);
    }

    addComment(taskId, user, commentText) {
        return this.repository.addComment(taskId, user._id, commentText);
    }

}

module.exports = TaskService;
