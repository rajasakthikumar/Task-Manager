const asyncHandler = require('../middleware/asynchandler');

class UserController {
    
    constructor(userService) {
        this.userService = userService;
        console.log('User Controller created');
    }

    registerUser = asyncHandler(async (req, res) => {
        const { username, password } = req.body;
        const user = await this.userService.registerUser({ username, password });
        res.status(201).json(user);
    });

    loginUser = asyncHandler(async (req, res) => {
        const { username, password } = req.body;
        const user = await this.userService.loginUser(username, password);
        res.status(200).json(user);
    });

    getUserById = asyncHandler(async (req, res) => {
        const userId = req.params.id;
        const user = await this.userService.getUserById(userId);
        res.status(200).json(user);
    });

    getUserByUsername = asyncHandler(async (req, res) => {
        const username = req.params.username;
        const user = await this.userService.getUserByUsername(username);
        res.status(200).json(user);
    });

    getUser = asyncHandler(async (req, res) => {
        const username = req.params.username;
        const role = req.params.role.toLowerCase();
        const user = await this.userService.getUserByRole(username, role);
        res.status(200).json(user);
    });

    getAllUsers = asyncHandler(async (req, res) => {
        const users = await this.userService.getAllUsers();
        res.status(200).json(users);
    });
}

module.exports = UserController;
