const BaseRepository = require('./baseRepository');
const User = require('../models/user');
const AuditLog = require('../models/auditLog');
const payment = require('../models/payment');
const CustomError = require('../util/customError');

class UserRepository extends BaseRepository {
    constructor() {
        console.log('User Repository created');
        // this.Payment = Payment;
        super(User);
    }

    async findByUsername(username) {
        try {
            return await this.model.findOne({ username });
        } catch (error) {
            throw new Error(`Error finding user by username: ${error.message}`);
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

}

module.exports = UserRepository;
