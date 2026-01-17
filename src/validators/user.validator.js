const Joi = require('joi');

/**
 * Create user validation schema
 */
const createUserSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .required(),

    first_name: Joi.string()
        .max(100)
        .optional(),

    last_name: Joi.string()
        .max(100)
        .optional(),

    domain: Joi.string()
        .max(100)
        .optional(),

    role: Joi.string()
        .optional()
});

/**
 * Update user validation schema
 */
const updateUserSchema = Joi.object({
    email: Joi.string()
        .email()
        .optional(),

    first_name: Joi.string()
        .max(100)
        .optional(),

    last_name: Joi.string()
        .max(100)
        .optional(),

    domain: Joi.string()
        .max(100)
        .optional(),

    role: Joi.string()
        .optional()
}).min(1); // At least one field must be provided

/**
 * Change password validation schema
 */
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            'any.required': 'Current password is required'
        }),

    newPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'New password must be at least 6 characters long',
            'any.required': 'New password is required'
        })
});

module.exports = {
    createUserSchema,
    updateUserSchema,
    changePasswordSchema
};
