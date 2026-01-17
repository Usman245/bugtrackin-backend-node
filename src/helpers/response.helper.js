const { HTTP_STATUS } = require('../utils/constants');

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} data - Response data
 */
const sendSuccess = (res, statusCode = HTTP_STATUS.OK, message = 'Success', data = null) => {
    const response = {
        success: true,
        message,
        ...(data && { data })
    };

    return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {*} errors - Error details
 */
const sendError = (res, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message = 'Error', errors = null) => {
    const response = {
        success: false,
        message,
        ...(errors && { errors })
    };

    return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Data array
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @param {string} message - Success message
 */
const sendPaginatedResponse = (res, data, page, limit, total, message = 'Success') => {
    const totalPages = Math.ceil(total / limit);

    const response = {
        success: true,
        message,
        data,
        pagination: {
            currentPage: page,
            totalPages,
            pageSize: limit,
            totalItems: total,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };

    return res.status(HTTP_STATUS.OK).json(response);
};

module.exports = {
    sendSuccess,
    sendError,
    sendPaginatedResponse
};
