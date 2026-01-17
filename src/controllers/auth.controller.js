const AuthService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../helpers/response.helper');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

/**
 * Authentication Controller
 */
const AuthController = {
    /**
     * Register new user
     * POST /api/auth/register
     */
    register: asyncHandler(async (req, res) => {
        const result = await AuthService.register(req.body);

        logger.info(`New user registered: ${result.user.email}`);

        return sendSuccess(
            res,
            HTTP_STATUS.CREATED,
            SUCCESS_MESSAGES.REGISTER_SUCCESS,
            result
        );
    }),

    /**
     * Login user
     * POST /api/auth/login
     */
    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const result = await AuthService.login(email, password);

        logger.info(`User logged in: ${email}`);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            SUCCESS_MESSAGES.LOGIN_SUCCESS,
            result
        );
    }),

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    refreshToken: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const result = await AuthService.refreshToken(userId);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Token refreshed successfully',
            result
        );
    }),

    /**
     * Logout user
     * POST /api/auth/logout
     */
    logout: asyncHandler(async (req, res) => {
        // In a real application, you might want to blacklist the token
        logger.info(`User logged out: ${req.user.email}`);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            SUCCESS_MESSAGES.LOGOUT_SUCCESS
        );
    }),

    /**
     * Get current user profile
     * GET /api/auth/me
     */
    getProfile: asyncHandler(async (req, res) => {
        const UserModel = require('../models/user.model');
        const user = await UserModel.findById(req.user.id);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Profile retrieved successfully',
            user
        );
    })
};

module.exports = AuthController;
