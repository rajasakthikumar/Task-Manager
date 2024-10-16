const BaseRepository = require('./baseRepository');
const User = require('../models/user');
const AuditLog = require('../models/auditLog');
const CustomError = require('../util/customError');

class UserRepository extends BaseRepository {
    constructor() {
        console.log('User Repository created');
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
            console.log("@!@!@!@!@!@! userData",userData);
            const newUser = await this.create(userData);
            await AuditLog.create({
                action: 'User Registered',
                performedBy: newUser._id,
                entity: 'User',
                entityId: newUser._id,
                changes: { username: newUser.username, roles: newUser.roles }
            });
            return newUser;
        }
        catch (e) {
            throw new CustomError("Failed to create the user");
        }
    }

    async getAllAdmins() {
        return await this.model.find({ roles: 'admin' }).select('username roles');
    }

    async getUserByIds(userIds) {
        const users = await this.model.find({id: {$in:userIds}}).populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                model: 'Permission'
            }
        });

        if (!users) {    
            throw new CustomError('overdue users not found or error in fetching', 404);
        }

        return users;
    }

}

module.exports = UserRepository;
