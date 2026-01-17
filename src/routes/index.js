const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/plans', require('./plan.routes'));

// API info endpoint
router.get('/', (req, res) => {
    res.json({
        message: 'Bug Tracking API v1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            roles: '/api/roles',
            plans: '/api/plans'
        }
    });
});

module.exports = router;
