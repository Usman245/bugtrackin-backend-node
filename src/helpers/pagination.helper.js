const { PAGINATION } = require('../utils/constants');

/**
 * Parse pagination parameters from request query
 * @param {Object} query - Request query object
 * @returns {Object} Pagination parameters
 */
const getPaginationParams = (query) => {
    const page = parseInt(query.page) || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(
        parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT,
        PAGINATION.MAX_LIMIT
    );
    const offset = (page - 1) * limit;

    return { page, limit, offset };
};

/**
 * Calculate pagination metadata
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);

    return {
        currentPage: page,
        totalPages,
        pageSize: limit,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
};

module.exports = {
    getPaginationParams,
    getPaginationMeta
};
