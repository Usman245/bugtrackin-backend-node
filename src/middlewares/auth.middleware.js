const { verifyToken } = require('../helpers/token.helper');
const { sendError } = require('../helpers/response.helper');
const { HTTP_STATUS, ERROR_MESSAGES, ROLES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Authenticate user using JWT token
 */
const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                ERROR_MESSAGES.UNAUTHORIZED
            );
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyToken(token);

        // Attach user info to request
        req.user = decoded;

        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        return sendError(
            res,
            HTTP_STATUS.UNAUTHORIZED,
            ERROR_MESSAGES.TOKEN_INVALID
        );
    }
};

/**
 * Authorize user based on roles
 * @param  {...string} allowedRoles - Allowed roles
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return sendError(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                ERROR_MESSAGES.UNAUTHORIZED
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return sendError(
                res,
                HTTP_STATUS.FORBIDDEN,
                ERROR_MESSAGES.FORBIDDEN
            );
        }

        next();
    };
};

/**
 * Check if user is admin
 */
const isAdmin = authorize(ROLES.ADMIN);

/**
 * Check if user is admin or developer
 */
const isDeveloperOrAdmin = authorize(ROLES.ADMIN, ROLES.DEVELOPER);

module.exports = {
    authenticate,
    authorize,
    isAdmin,
    isDeveloperOrAdmin
};
