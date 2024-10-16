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
const PaymentRepository = require('./repositories/payment');
const PaymentController = require('./controllers/payment');
const PaymentService = require('./services/payment');

const taskRepository = new TaskRepository();
const commentRepository = new CommentRepository();
const statusRepository = new StatusRepository();
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const auditLogRepository = new AuditLogRepository();
const paymentRepository = new PaymentRepository();

const roleService = new RoleService(roleRepository);
const auditLogService = new AuditLogService(auditLogRepository);
const userService = new UserService(userRepository, roleService, auditLogService);
const statusService = new StatusService(statusRepository, auditLogService);
const commentService = new CommentService(commentRepository);
const paymentService = new PaymentService(paymentRepository,userService);
const taskService = new TaskService(
    taskRepository,
    commentService,
    userService,
    statusService,
    auditLogService
);

const taskController = new TaskController(taskService);
const statusController = new StatusController(statusService);
const userController = new UserController(userService);
const roleController = new RoleController(roleService);
const commentController = new CommentController(commentService);
const paymentController = new PaymentController(paymentService);

module.exports = {
    taskController,
    statusController,
    userController,
    roleController,
    commentController,
    paymentController
};
