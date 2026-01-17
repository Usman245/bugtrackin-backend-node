const db = require('../config/db');
const logger = require('../utils/logger');

/**
 * Seed default roles
 */
const seedRoles = async () => {
    try {
        logger.info('Starting roles seeder...');

        const roles = [
            { name: 'admin', description: 'Administrator with full access' },
            { name: 'developer', description: 'Developer who can manage bugs and projects' },
            { name: 'tester', description: 'Tester who can create and update bugs' },
            { name: 'viewer', description: 'Viewer with read-only access' }
        ];

        for (const role of roles) {
            // Check if role already exists
            const existing = await db.query(
                'SELECT id FROM roles WHERE name = $1',
                [role.name]
            );

            if (existing.rows.length === 0) {
                await db.query(
                    'INSERT INTO roles (name, description) VALUES ($1, $2)',
                    [role.name, role.description]
                );
                logger.info(`✓ Created role: ${role.name}`);
            } else {
                logger.info(`- Role already exists: ${role.name}`);
            }
        }

        logger.info('Roles seeder completed successfully\n');
    } catch (error) {
        logger.error('Error seeding roles:', error);
        throw error;
    }
};

// Run seeder if called directly
if (require.main === module) {
    seedRoles()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Seeder failed:', error);
            process.exit(1);
        });
}

module.exports = seedRoles;
