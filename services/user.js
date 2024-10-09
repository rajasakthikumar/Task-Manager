// services/userService.js
const BaseService = require('./baseService');
const { generateToken } = require('../util/jwt');

class UserService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    async registerUser(userData) {
        const existingUser = await this.repository.findByUsername(userData.username);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const newUser = await this.repository.createUser(userData);
        const token = await generateToken(newUser._id);
        return {
            _id: newUser._id,
            username: newUser.username,
            roles: newUser.roles,
            token: "Bearer " + token
        };
    }

    async loginUser(username, password) {
        const user = await this.repository.validateUser(username, password);
        if (!user) {
            throw new Error('Invalid username or password');
        }

        const token = await generateToken(user._id);
        return {
            _id: user._id,
            username: user.username,
            roles: user.roles,
            token: "Bearer " + token
        };
    }

    async getUserById(id) {
        const user = await this.repository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getAllUsers() {
        return await this.repository.findAll();
    }
}

module.exports = UserService;
