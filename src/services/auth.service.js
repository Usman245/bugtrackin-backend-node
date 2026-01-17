const UserModel = require('../models/user.model');
const { hashPassword, comparePassword } = require('../helpers/password.helper');
const { generateAccessToken, generateRefreshToken } = require('../helpers/token.helper');
const { ERROR_MESSAGES } = require('../utils/constants');

/**
 * Authentication Service - Business logic for authentication
 */
const AuthService = {
    /**
     * Register new user
     */
    register: async (userData) => {
        const { email, password, first_name, last_name, domain, role, plan } = userData;

        // Check if user already exists
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new Error(ERROR_MESSAGES.USER_EXISTS);
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
            role,
            plan
        });

        // Generate tokens
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        const refreshToken = generateRefreshToken({
            id: user.id,
            email: user.email
        });

        return {
            user,
            accessToken,
            refreshToken
        };
    },

    /**
     * Login user
     */
    login: async (email, password) => {
        // Find user
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        const refreshToken = generateRefreshToken({
            id: user.id,
            email: user.email
        });

        // Remove password from response
        delete user.password_hash;

        return {
            user,
            accessToken,
            refreshToken
        };
    },

    /**
     * Refresh access token
     */
    refreshToken: async (userId) => {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        return { accessToken };
    }
};

module.exports = AuthService;
