const BaseService = require('./baseService');

class TaskService extends BaseService {
    constructor(repository) {
        console.log("Task Service created");
        super(repository);
    }

    getAllTasks(user) {
        return this.repository.getAllTasks(user._id);
    }

    findById(id, user) {
        return this.repository.findById(id, user._id);
    }

    createTask(task, user, assignedTo = null) {
        return this.repository.createTask(task, user, assignedTo);
    }

    updateTask(id, task, user) {
        return this.repository.updateTask(id, task, user._id);
    }

    assignTask(id, user, assignedToId) {
        return this.repository.assignTask(id, user._id, assignedToId);
    }

    updateTaskStatus(taskId, statusId, user) {
        return this.repository.updateTaskStatus(taskId, statusId, user._id);
    }

    deleteTask(id, user) {
        return this.repository.deleteTask(id, user._id);
    }

    deleteAllTasks(user) {
        return this.repository.deleteTasks(user._id);
    }

    findTasksByStatus(statusId, user) {
        return this.repository.findByStatus(statusId, user._id);
    }

    async addComment(taskId, userId, commentText) {
        return await this.repository.addComment(taskId, userId, commentText);
    }

}

module.exports = TaskService;
