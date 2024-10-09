const TaskRepository = require('./repositories/task');
const CommentRepository = require('./repositories/comment');
const TaskService = require('./services/task');
const TaskController = require('./controllers/task');
const StatusRepository = require('./repositories/status');
const StatusService = require('./services/status');
const StatusController = require('./controllers/status');
const UserRepository = require('./repositories/user');
const UserService = require('./services/user');
const UserController = require('./controllers/user');

const taskRepository = new TaskRepository();
const commentRepository = new CommentRepository();
const taskService = new TaskService(taskRepository, commentRepository);
const taskController = new TaskController(taskService);

const statusRepository = new StatusRepository();
const statusService = new StatusService(statusRepository);
const statusController = new StatusController(statusService);

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

module.exports = {
    taskController,
    statusController,
    userController
};
