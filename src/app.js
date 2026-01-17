const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(cors({ origin: config.config.corsOrigin }));
app.use(express.json());
// Handle JSON syntax errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        logger.error(`JSON Parse Error: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON format. Please check your request body.'
        });
    }
    next();
});
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: config.config.nodeEnv
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Bug Tracking API',
        version: '1.0.0',
        documentation: '/api',
        health: '/health'
    });
});

// API Routes
app.use('/api', routes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
