const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const PORT = config.config.port;

// Start server
const server = app.listen(PORT, () => {
    logger.info(`\n🚀 Server is running on port ${PORT}`);
    logger.info(`📍 Environment: ${config.config.nodeEnv}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    logger.info(`🔗 API base URL: http://localhost:${PORT}/api\n`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
    logger.info(`\n${signal} signal received: closing HTTP server`);

    server.close(() => {
        logger.info('HTTP server closed');

        // Close database connection
        config.db.end(() => {
            logger.info('Database pool closed');
            process.exit(0);
        });
    });

    // Force close after 10 seconds
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    gracefulShutdown('UNHANDLED_REJECTION');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

module.exports = server;
