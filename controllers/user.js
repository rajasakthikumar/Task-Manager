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

    assignRole = asyncHandler(async (req, res) => {
        const { userId, roleId } = req.body;
        const user = await User.findById(userId);
        const role = await Role.findById(roleId);

        if (!user || !role) {
            return res.status(404).json({ message: 'User or Role not found' });
        }

        if (!user.roles.includes(roleId)) {
            user.roles.push(roleId);
            await user.save();
        }

        res.status(200).json(user);
    });

    getUserDetails = asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id).populate('roles');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    });

    assignRole = asyncHandler(async (req, res) => {
        const { userId, roleId } = req.body;
        const updatedUser = await this.userService.assignRole(userId, roleId);
        res.status(200).json(updatedUser);
    });

}

module.exports = UserController;
