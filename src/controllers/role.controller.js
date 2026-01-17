const RoleService = require('../services/role.service');
const { sendSuccess } = require('../helpers/response.helper');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

/**
 * Role Controller
 */
const RoleController = {
    /**
     * Get all roles
     * GET /api/roles
     */
    getAllRoles: asyncHandler(async (req, res) => {
        const roles = await RoleService.getAllRoles();

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Roles retrieved successfully',
            roles
        );
    }),

    /**
     * Get role by ID
     * GET /api/roles/:id
     */
    getRoleById: asyncHandler(async (req, res) => {
        const role = await RoleService.getRoleById(req.params.id);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Role retrieved successfully',
            role
        );
    }),

    /**
     * Create new role
     * POST /api/roles
     */
    createRole: asyncHandler(async (req, res) => {
        const role = await RoleService.createRole(req.body);

        logger.info(`New role created: ${role.name}`);

        return sendSuccess(
            res,
            HTTP_STATUS.CREATED,
            SUCCESS_MESSAGES.CREATED,
            role
        );
    }),

    /**
     * Update role
     * PUT /api/roles/:id
     */
    updateRole: asyncHandler(async (req, res) => {
        const role = await RoleService.updateRole(req.params.id, req.body);

        logger.info(`Role updated: ${role.id}`);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            SUCCESS_MESSAGES.UPDATED,
            role
        );
    }),

    /**
     * Delete role
     * DELETE /api/roles/:id
     */
    deleteRole: asyncHandler(async (req, res) => {
        const result = await RoleService.deleteRole(req.params.id);

        logger.info(`Role deleted: ${req.params.id}`);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            SUCCESS_MESSAGES.DELETED,
            result
        );
    })
};

module.exports = RoleController;
