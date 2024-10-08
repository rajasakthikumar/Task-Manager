const UserRepository = require("../repositories/user");
const { generateToken } = require("../util/jwt");
const BaseService = require("./baseService");

class UserService extends BaseService {
    constructor(UserRepository) {
        console.log('User Service created');
        super(UserRepository);
    }

    async registerUser(userData) {
        console.log('User register starts')
        const existingUser = await this.repository.findByUsername(userData.username);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const newUser = await this.repository.createUser(userData);
        const token = await generateToken(newUser._id)
        return {
            _id: newUser._id,
            username: newUser.username,
            role: newUser.role,
            token: "Bearer " + token
        };
    }

    async loginUser(username, password) {
        const user = await this.repository.validateUser(username, password);
        if (!user) {
            throw new Error('Invalid username or password');
        }

        const token = await generateToken(user._id)
        return {
            _id: user._id,
            username: user.username,
            role: user.role,
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

    async getUserByUsername(username) {
        const user = await this.repository.findByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getUserByRole(username, role) {
        const user = await this.repository.findUser(username, role);
        if (!user) {
            throw new Error(`User with username ${username} and role ${role} does not exist`);
        }
        return user;
    }

    async getAllUsers() {
        const users = await this.repository.getAllUsers();
        console.log(users);
        return users;
    }
}

module.exports = UserService;
