const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload (user data)
 * @returns {string} JWT token
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.accessExpiresIn
    });
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - Token payload (user data)
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn
    });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - Secret key (optional, defaults to access token secret)
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token, secret = config.jwt.secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    decodeToken
};
