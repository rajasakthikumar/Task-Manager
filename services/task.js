// taskService.js
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
        return this.repository.getTasksByStatus(user._id, statusId);
    }

    addComment(taskId, user, commentText) {
        return this.repository.addComment(taskId, user._id, commentText);
    }

    getTasksByPriority(user, priority) {
        return this.repository.getTasksByPriority(user._id, priority);
    }

    updateTaskPriority(id, user, priority) {
        return this.repository.updateTaskPriority(id, user._id, priority);
    }

    getTasksAssignedTo(user) {
        return this.repository.getTasksAssignedTo(user._id);
    }

    getTasksCreatedBy(user) {
        return this.repository.getTasksCreatedBy(user._id);
    }

    softDeleteTask(id, user) {
        return this.repository.softDeleteTask(id, user._id);
    }

    restoreTask(id, user) {
        return this.repository.restoreTask(id, user._id);
    }

    getDeletedTasks(user) {
        return this.repository.getDeletedTasks(user._id);
    }

    getTasksByDateRange(user, startDate, endDate) {
        return this.repository.getTasksByDateRange(user._id, startDate, endDate);
    }

    searchTasks(user, searchTerm) {
        return this.repository.searchTasks(user._id, searchTerm);
    }

    getOverdueTasks(user) {
        return this.repository.getOverdueTasks(user._id);
    }

    getTasksDueToday(user) {
        return this.repository.getTasksDueToday(user._id);
    }

    unassignTask(id, user) {
        return this.repository.unassignTask(id, user._id);
    }

    updateTaskEndDate(id, user, endDate) {
        return this.repository.updateTaskEndDate(id, user._id, endDate);
    }
}

module.exports = TaskService;
