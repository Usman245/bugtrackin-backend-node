const { sendError } = require('../helpers/response.helper');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return sendError(
            res,
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            'Validation error',
            err.details
        );
    }

    if (err.name === 'UnauthorizedError' || err.message.includes('token')) {
        return sendError(
            res,
            HTTP_STATUS.UNAUTHORIZED,
            ERROR_MESSAGES.UNAUTHORIZED
        );
    }

    if (err.name === 'JsonWebTokenError') {
        return sendError(
            res,
            HTTP_STATUS.UNAUTHORIZED,
            ERROR_MESSAGES.TOKEN_INVALID
        );
    }

    if (err.name === 'TokenExpiredError') {
        return sendError(
            res,
            HTTP_STATUS.UNAUTHORIZED,
            ERROR_MESSAGES.TOKEN_EXPIRED
        );
    }

    // PostgreSQL errors
    if (err.code === '23505') { // Unique violation
        return sendError(
            res,
            HTTP_STATUS.CONFLICT,
            'Resource already exists'
        );
    }

    if (err.code === '23503') { // Foreign key violation
        return sendError(
            res,
            HTTP_STATUS.BAD_REQUEST,
            'Referenced resource does not exist'
        );
    }

    // Default error
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

    return sendError(
        res,
        statusCode,
        message,
        process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
    );
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    return sendError(
        res,
        HTTP_STATUS.NOT_FOUND,
        `Route ${req.method} ${req.path} not found`
    );
};

module.exports = {
    errorHandler,
    notFoundHandler
};
