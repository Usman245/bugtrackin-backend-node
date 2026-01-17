const UserService = require('../services/user.service');
const { sendSuccess, sendPaginatedResponse } = require('../helpers/response.helper');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');
const { getPaginationParams } = require('../helpers/pagination.helper');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

/**
 * User Controller
 */
const UserController = {
    /**
     * Get all users
     * GET /api/users
     */
    getAllUsers: asyncHandler(async (req, res) => {
        const { page, limit, offset } = getPaginationParams(req.query);
        const { users, total } = await UserService.getAllUsers(limit, offset);

        return sendPaginatedResponse(
            res,
            users,
            page,
            limit,
            total,
            'Users retrieved successfully'
        );
    }),

    /**
     * Get user by ID
     * GET /api/users/:id
     */
    getUserById: asyncHandler(async (req, res) => {
        const user = await UserService.getUserById(req.params.id);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'User retrieved successfully',
            user
        );
    }),

    /**
     * Create new user
     * POST /api/users
     */
    createUser: asyncHandler(async (req, res) => {
        const user = await UserService.createUser(req.body);

        logger.info(`New user created: ${user.email}`);

        return sendSuccess(
            res,
            HTTP_STATUS.CREATED,
            SUCCESS_MESSAGES.CREATED,
            user
        );
    }),

    /**
     * Update user
     * PUT /api/users/:id
     */
    updateUser: asyncHandler(async (req, res) => {
        const user = await UserService.updateUser(req.params.id, req.body);

        logger.info(`User updated: ${user.id}`);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            SUCCESS_MESSAGES.UPDATED,
            user
        );
    }),

    /**
     * Delete user
     * DELETE /api/users/:id
     */
    deleteUser: asyncHandler(async (req, res) => {
        const result = await UserService.deleteUser(req.params.id);

        logger.info(`User deleted: ${req.params.id}`);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            SUCCESS_MESSAGES.DELETED,
            result
        );
    }),

    /**
     * Change user password
     * PUT /api/users/:id/password
     */
    changePassword: asyncHandler(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const result = await UserService.changePassword(
            req.params.id,
            currentPassword,
            newPassword
        );

        logger.info(`Password changed for user: ${req.params.id}`);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Password changed successfully',
            result
        );
    })
};

module.exports = UserController;
