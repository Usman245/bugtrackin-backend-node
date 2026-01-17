const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createUserSchema, updateUserSchema, changePasswordSchema } = require('../validators/user.validator');

/**
 * @route   GET /api/users
 * @desc    Get all users (with pagination)
 * @access  Private (Admin only)
 */
router.get('/', authenticate, isAdmin, UserController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authenticate, UserController.getUserById);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private (Admin only)
 */
router.post('/', validate(createUserSchema), UserController.createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, isAdmin, validate(updateUserSchema), UserController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, isAdmin, UserController.deleteUser);

/**
 * @route   PUT /api/users/:id/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/:id/password', authenticate, validate(changePasswordSchema), UserController.changePassword);

module.exports = router;
