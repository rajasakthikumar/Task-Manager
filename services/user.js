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
            email: newUser.email,
            roles: newUser.roles,
            token: 'Bearer ' + token
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
            email: user.email,
            roles: user.roles,
            token: 'Bearer ' + token
        };
    }

    async getUserById(id) {
        const user = await this.repository.findById(id).populate('roles');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getAllUsers() {
        return await this.repository.findAll({}, { populate: 'roles' });
    }

    async assignRole(userId, roleId) {
        const user = await this.repository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!user.roles.includes(roleId)) {
            user.roles.push(roleId);
            await user.save();
        }

        return user;
    }
}

module.exports = UserService;
