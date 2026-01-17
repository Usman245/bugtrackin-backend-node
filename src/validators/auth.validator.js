const Joi = require('joi');

/**
 * Register validation schema
 */
const registerSchema = Joi.object({

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required'
        }),

    first_name: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'First name must not exceed 100 characters'
        }),

    last_name: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Last name must not exceed 100 characters'
        }),

    domain: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Domain must not exceed 100 characters'
        }),

    role: Joi.string()
        .required()
        .messages({
            'any.required': 'Role is required'
        }),

    plan: Joi.string()
        .required()
        .messages({
            'any.required': 'Plan is required'
        })
});

/**
 * Login validation schema
 */
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

/**
 * Refresh token validation schema
 */
const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({
            'any.required': 'Refresh token is required'
        })
});

module.exports = {
    registerSchema,
    loginSchema,
    refreshTokenSchema
};
