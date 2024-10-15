const asyncHandler = require('../middleware/asynchandler');
const CustomError = require('../util/customError');

class UserController {
    constructor(userService) {
        this.userService = userService;
        console.log('User Controller created');
    }

    registerUser = asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;
        console.log(`@!@!@!@!@! USerController ${username}`);

        const user = await this.userService.registerUser({
            username,
            email,
            password
        });

        console.log(`@!@!@!@! registerUSer Called`)
        res.status(201).json(user);
    });

    loginUser = asyncHandler(async (req, res) => {
        const { username, password } = req.body;
        const user = await this.userService.loginUser(
            username,
            password
        );
        res.status(200).json(user);
    });

    getUserById = asyncHandler(async (req, res) => {
        const userId = req.params.id;
        const user = await this.userService.getUserById(userId);
        res.status(200).json(user);
    });

    getAllUsers = asyncHandler(async (req, res) => {
        const users = await this.userService.getAllUsers();
        res.status(200).json(users);
    });

    assignRole = asyncHandler(async (req, res) => {
        const { userId, roleId } = req.body;
        const updatedUser = await this.userService.assignRole(
            userId,
            roleId
        );
        res.status(200).json(updatedUser);
    });
}

module.exports = UserController;
