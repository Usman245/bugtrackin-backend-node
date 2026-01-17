const Joi = require('joi');
const { sendError } = require('../helpers/response.helper');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Validate request using Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors
            stripUnknown: true // Remove unknown fields
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return sendError(
                res,
                HTTP_STATUS.UNPROCESSABLE_ENTITY,
                'Validation failed',
                errors
            );
        }

        // Replace req.body with validated value
        req.body = value;
        next();
    };
};

module.exports = validate;
