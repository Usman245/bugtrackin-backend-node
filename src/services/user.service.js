const UserModel = require('../models/user.model');
const { hashPassword, comparePassword } = require('../helpers/password.helper');

/**
 * User Service - Business logic for user operations
 */
const UserService = {
    /**
     * Get all users with pagination
     */
    getAllUsers: async (limit, offset) => {
        const users = await UserModel.findAll(limit, offset);
        const total = await UserModel.count();
        return { users, total };
    },

    /**
     * Get user by ID
     */
    getUserById: async (id) => {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    /**
     * Create new user
     */
    createUser: async (userData) => {
        const { email, password, first_name, last_name, domain, role } = userData;

        // Check if user exists
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const password_hash = await hashPassword(password);

        // Create user
        const user = await UserModel.create({
            email,
            password_hash,
            first_name,
            last_name,
            domain,
            role
        });

        return user;
    },

    /**
     * Update user
     */
    updateUser: async (id, userData) => {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        // Check if email is being changed and if it's already taken
        if (userData.email && userData.email !== user.email) {
            const existingUser = await UserModel.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('Email already in use');
            }
        }

        // Check if username is being changed and if it's already taken
        if (userData.username && userData.username !== user.username) {
            const existingUsername = await UserModel.findByUsername(userData.username);
            if (existingUsername) {
                throw new Error('Username already taken');
            }
        }

        const updatedUser = await UserModel.update(id, userData);
        return updatedUser;
    },

    /**
     * Delete user
     */
    deleteUser: async (id) => {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        await UserModel.delete(id);
        return { message: 'User deleted successfully' };
    },

    /**
     * Change user password
     */
    changePassword: async (id, currentPassword, newPassword) => {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        // Get user with password
        const userWithPassword = await UserModel.findByEmail(user.email);

        // Verify current password
        const isPasswordValid = await comparePassword(currentPassword, userWithPassword.password_hash);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const password_hash = await hashPassword(newPassword);

        // Update password
        await UserModel.updatePassword(id, password_hash);
        return { message: 'Password changed successfully' };
    }
};

module.exports = UserService;
