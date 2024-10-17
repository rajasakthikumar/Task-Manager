const BaseService = require('./baseService');
const { generateToken } = require('../util/jwt');
const CustomError = require('../util/customError');
const { populateRolesAndPermissions } = require('../util/populate');

class UserService extends BaseService {
    constructor(userRepository, roleService, auditLogService) {
        super(userRepository);
        this.roleService = roleService;
        this.auditLogService = auditLogService;
    }

    async registerUser(userData) {
        const existingUser = await this.repository.findByUsername(userData.username);
        if (existingUser) {
            throw new CustomError('User already exists');
        }

        if (!userData.roles) {
            const role = await this.roleService.getRoleByName('user');
            if (!role) {
                throw new CustomError('User role not found', 500);
            }
            userData.roles = [role._id];
        }

        const newUser = await this.repository.createUser(userData);

        await this.auditLogService.create({
            action: 'User Registered',
            performedBy: newUser._id,
            entity: 'User',
            entityId: newUser._id,
            changes: {
                username: newUser.username,
                email: newUser.email,
                roles: newUser.roles
            },
        });

        await populateRolesAndPermissions(newUser);

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

        const foundUser = await this.getUserById(user._id);

        const token = await generateToken(foundUser._id);

        return {
            _id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
            roles: foundUser.roles,
            token: 'Bearer ' + token
        };
    }

    async getUserById(id) {
        const query = this.repository.findById(id);
        const user = await populateRolesAndPermissions(query);
        if (!user) {
            throw new CustomError('User not found');
        }
        return user;
    }

    async getAllUsers() {
        const query = this.repository.findAll();
        return await populateRolesAndPermissions(query);
    }

    async assignRole(userId, roleId) {
        const user = await this.repository.findById(userId);
        if (!user) {
            throw new CustomError('User not found');
        }

        const role = await this.roleService.getRoleById(roleId);
        if (!role) {
            throw new CustomError('Role not found');
        }

        if (!user.roles.includes(roleId)) {
            user.roles.push(roleId);
            await user.save();

            await this.auditLogService.create({
                action: 'Role Assigned',
                performedBy: userId,
                entity: 'User',
                entityId: userId,
                changes: {
                    roles: user.roles
                },
            });
        }

        const savedUser = await this.getUserById(userId);
        return savedUser;
    }

    async getUsersById(userIds) {
        const users = await this.repository.getUserByIds(userIds);
        return users;
    }
}

module.exports = UserService;
