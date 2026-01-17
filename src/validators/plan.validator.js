const Joi = require('joi');

/**
 * Create Plan validation schema
 */
const createPlanSchema = Joi.object({
    stripe_id: Joi.string()
        .max(150)
        .required()
        .messages({
            'string.max': 'Stripe ID must not exceed 150 characters',
            'any.required': 'Stripe ID is required'
        }),

    name: Joi.string()
        .max(100)
        .required()
        .messages({
            'string.max': 'Name must not exceed 100 characters',
            'any.required': 'Name is required'
        }),

    description: Joi.string()
        .optional()
        .allow(null, ''),

    number_of_users: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.min': 'Number of users must be at least 0',
            'any.required': 'Number of users is required'
        }),

    amount: Joi.number()
        .min(0)
        .required()
        .messages({
            'number.min': 'Amount must be at least 0',
            'any.required': 'Amount is required'
        }),

    currency: Joi.string()
        .max(10)
        .default('USD')
        .optional()
        .messages({
            'string.max': 'Currency code must not exceed 10 characters'
        }),

    billing_interval: Joi.string()
        .valid('day', 'week', 'month', 'year')
        .required()
        .messages({
            'any.only': 'Billing interval must be one of: day, week, month, year',
            'any.required': 'Billing interval is required'
        }),

    trial_period_days: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.min': 'Trial period days must be at least 0'
        }),

    is_enterprise: Joi.boolean()
        .optional(),

    is_promotional: Joi.boolean()
        .optional(),

    is_active: Joi.boolean()
        .optional()
});

/**
 * Update Plan validation schema
 */
const updatePlanSchema = Joi.object({
    name: Joi.string()
        .max(100)
        .optional(),

    description: Joi.string()
        .optional()
        .allow(null, ''),

    number_of_users: Joi.number()
        .integer()
        .min(0)
        .optional(),

    amount: Joi.number()
        .min(0)
        .optional(),

    currency: Joi.string()
        .max(10)
        .optional(),

    billing_interval: Joi.string()
        .valid('day', 'week', 'month', 'year')
        .optional(),

    trial_period_days: Joi.number()
        .integer()
        .min(0)
        .optional(),

    is_enterprise: Joi.boolean()
        .optional(),

    is_promotional: Joi.boolean()
        .optional(),

    is_active: Joi.boolean()
        .optional(),

    is_archived: Joi.boolean()
        .optional()
});

module.exports = {
    createPlanSchema,
    updatePlanSchema
};
