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
const RoleRepository = require('./repositories/role');
const RoleService = require('./services/role');
const RoleController = require('./controllers/role');
const AuditLogRepository = require('./repositories/auditLog');
const AuditLogService = require('./services/auditLog');
const CommentController = require('./controllers/comment');
const CommentService = require('./services/comment');

const taskRepository = new TaskRepository();
const commentRepository = new CommentRepository();
const statusRepository = new StatusRepository();
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const auditLogRepository = new AuditLogRepository();

const taskService = new TaskService(taskRepository, commentRepository);
const statusService = new StatusService(statusRepository, auditLogRepository);
const userService = new UserService(userRepository,roleRepository);
const roleService = new RoleService(roleRepository);
const auditLogService = new AuditLogService(auditLogRepository);
const commentService = new CommentService(commentRepository);

const taskController = new TaskController(taskService);
const statusController = new StatusController(statusService);
const userController = new UserController(userService);
const roleController = new RoleController(roleService);
const commentController = new CommentController(commentService);

module.exports = {
    taskController,
    statusController,
    userController,
    roleController,
    commentController
};