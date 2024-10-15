const BaseService = require('./baseService');
const { generateToken } = require('../util/jwt');
const CustomError = require('../util/customError');

class UserService extends BaseService {
    constructor(userRepository, roleRepository) {
        super(userRepository);
        this.roleRepository = roleRepository; // Injecting roleRepository here
    }

    async registerUser(userData) {
        const existingUser = await this.repository.findByUsername(userData.username);
        if (existingUser) {
            console.error('@!@!@!@! User creation failed');
            throw new CustomError('User already exists');
        }

        if (!userData.roles) {
            const role = await this.roleRepository.findByName('user');
            console.log('@!@!@!@! Role Found');
            if (!role) {
                throw new CustomError('user role not found', 500);
            }
            userData.roles = role._id; 
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
            throw new CustomError('Invalid username or password');
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
            throw new CustomError('User not found');
        }
        return user;
    }

    async getAllUsers() {
        return await this.repository.findAll({}, { populate: 'roles' });
    }

    async assignRole(userId, roleId) {
        const user = await this.repository.findById(userId);
        if (!user) {
            throw new CustomError('User not found');
        }

        if (!user.roles.includes(roleId)) {
            user.roles.push(roleId);
            await user.save();
        }

        return user;
    }
}

module.exports = UserService;
