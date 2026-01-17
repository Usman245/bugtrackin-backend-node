const db = require('../config/db');

/**
 * Role Model - Database operations for roles
 */
const RoleModel = {
    /**
     * Find role by ID
     */
    findById: async (id) => {
        const result = await db.query(
            'SELECT * FROM roles WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    /**
     * Find role by name
     */
    findByName: async (name) => {
        const result = await db.query(
            'SELECT * FROM roles WHERE name = $1',
            [name]
        );
        return result.rows[0];
    },

    /**
     * Get all roles
     */
    findAll: async () => {
        const result = await db.query(
            'SELECT * FROM roles ORDER BY name ASC'
        );
        return result.rows;
    },

    /**
     * Create new role
     */
    create: async (roleData) => {
        const { name, description } = roleData;
        const result = await db.query(
            'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        return result.rows[0];
    },

    /**
     * Update role
     */
    update: async (id, roleData) => {
        const { name, description } = roleData;
        const result = await db.query(
            'UPDATE roles SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
            [name, description, id]
        );
        return result.rows[0];
    },

    /**
     * Delete role
     */
    delete: async (id) => {
        const result = await db.query(
            'DELETE FROM roles WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    }
};

module.exports = RoleModel;
