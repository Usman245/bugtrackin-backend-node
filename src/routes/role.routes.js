const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/role.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @route   GET /api/roles
 * @desc    Get all roles
 * @access  Private
 */
router.get('/', RoleController.getAllRoles);

/**
 * @route   GET /api/roles/:id
 * @desc    Get role by ID
 * @access  Private
 */
router.get('/:id', authenticate, RoleController.getRoleById);

/**
 * @route   POST /api/roles
 * @desc    Create new role
 * @access  Private (Admin only)
 */
router.post('/', RoleController.createRole);

/**
 * @route   PUT /api/roles/:id
 * @desc    Update role
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, isAdmin, RoleController.updateRole);

/**
 * @route   DELETE /api/roles/:id
 * @desc    Delete role
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, isAdmin, RoleController.deleteRole);

module.exports = router;
