const BaseRepository = require('./baseRepository');
const User = require('../models/user');
const CustomError = require('../util/customError');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByUsername(username) {
        try {
            return await this.model.findOne({ username });
        } catch (error) {
            throw new CustomError(`Error finding user by username: ${error.message}`);
        }
    }

    async validateUser(username, password) {
        const user = await this.findByUsername(username);
        if (user && await user.matchPassword(password)) {
            return user;
        }
        return null;
    }

    async createUser(userData) {
        try {
            const newUser = await this.create(userData);
            return newUser;
        } catch (error) {
            throw new CustomError(`Failed to create the user: ${error.message}`);
        }
    }

    async getAllAdmins() {
        return await this.model.find({ roles: 'admin' }).select('username roles');
    }

    async getUserByIds(userIds) {
        const users = await this.model.find({ _id: { $in: userIds } }).populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                model: 'Permission'
            }
        });

        if (!users) {
            throw new CustomError('Users not found or error in fetching', 404);
        }
        return users;
    }

    async getUserById(id) {
        const query = this.model.findById(id);
        const user = await query.populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                model: 'Permission'
            }
        });
        if (!user) {
            throw new CustomError('User not found');
        }
        return user;
    }
}

module.exports = UserRepository;
