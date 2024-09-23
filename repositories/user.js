const User = require('../models/user');
const BaseRepositorySoftDelete = require('./baseRepositoryWithSoftDelete');
const bcrypt = require('bcryptjs');

class UserRepository extends BaseRepositorySoftDelete {
    constructor() {
        console.log('User Repository created');
        super(User);
    }

    // Create a new user
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    // Find a user by username
    async findByUsername(username) {
        return await User.findOne({ username });
    }

    // Validate user credentials (for login)
    async validateUser(username, password) {
        const user = await this.findByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            return user; // Return user if credentials are valid
        }
        return null; // Invalid credentials
    }

    // Find user by ID (overriding BaseRepository's method to exclude password)
    async findById(id) {
        return await User.findById(id).select('-password'); // Exclude password field
    }

    // Update user's password
    async updatePassword(id, newPassword) {
        const user = await this.findById(id);
        if (!user) throw new Error('User not found');

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        return user;
    }

    // Find user by username and role
    async findUserByRole(username, role) {
        return await User.findOne({ username, role });
    }

    // Soft delete user (override BaseRepositorySoftDelete)
    async deleteUserById(id) {
        return this.deleteById(id);
    }
}

module.exports = UserRepository;
