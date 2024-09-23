const StatusRepository = require('./repositories/status');
const StatusService = require('./services/status');
const StatusController = require('./controllers/status');

const TaskRepository = require('./repositories/task');
const TaskService = require('./services/task');
const TaskController = require('./controllers/task');

const UserRepository = require('./repositories/user');
const UserService = require('./services/user');
const UserController = require('./controllers/user');

const statusRepository = new StatusRepository();
const statusService = new StatusService(statusRepository);
const statusController = new StatusController(statusService);

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

module.exports = {
  statusController,
  taskController,
  userController
};