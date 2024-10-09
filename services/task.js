const BaseService = require('./baseService');
const {sendEmail} = require('./email');
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

    

    updateTask(id, task, user) {
        return this.repository.updateTask(id, task, user._id);
    }

   

    deleteTask(id, user) {
        return this.repository.deleteTask(id, user._id);
    }

    addComment(taskId, user, commentText) {
        return this.repository.addComment(taskId, user._id, commentText);
    }


    async createTask(task, user, assignedTo = null) {
        const newTask = await this.taskRepository.createTask(task, user, assignedTo);
    
        if (assignedTo) {
          await sendEmail(assignedTo.email, 'New Task Assigned', `You have been assigned a new task: ${task.title}`);
        }
    
        return newTask;
      }
    
      async assignTask(id, userId, assignedToId) {
        const updatedTask = await this.taskRepository.assignTask(id, userId, assignedToId);
    
        const assignedToUser = await this.taskRepository.getUserById(assignedToId);  // Assuming a method to get user by ID
        if (assignedToUser) {
          await sendEmail(assignedToUser.email, 'Task Assigned', `You have been assigned a task: ${updatedTask.title}`);
        }
    
        return updatedTask;
      }
    
      async updateTaskStatus(taskId, statusId, userId) {
        const updatedTask = await this.taskRepository.updateTaskStatus(taskId, statusId, userId);
    
        const taskOwner = await this.taskRepository.getUserById(updatedTask.user);
        if (taskOwner) {
          await sendEmail(taskOwner.email, 'Task Status Updated', `The status of your task "${updatedTask.title}" has been updated to "${updatedTask.status.statusName}".`);
        }
    
        return updatedTask;
      }
}

module.exports = TaskService;
