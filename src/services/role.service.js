const RoleModel = require('../models/role.model');

/**
 * Role Service - Business logic for role operations
 */
const RoleService = {
    /**
     * Get all roles
     */
    getAllRoles: async () => {
        const roles = await RoleModel.findAll();
        return roles;
    },

    /**
     * Get role by ID
     */
    getRoleById: async (id) => {
        const role = await RoleModel.findById(id);
        if (!role) {
            throw new Error('Role not found');
        }
        return role;
    },

    /**
     * Create new role
     */
    createRole: async (roleData) => {
        const { name, description } = roleData;

        // Check if role exists
        const existingRole = await RoleModel.findByName(name);
        if (existingRole) {
            throw new Error('Role already exists');
        }

        const role = await RoleModel.create({ name, description });
        return role;
    },

    /**
     * Update role
     */
    updateRole: async (id, roleData) => {
        const role = await RoleModel.findById(id);
        if (!role) {
            throw new Error('Role not found');
        }

        // Check if name is being changed and if it's already taken
        if (roleData.name && roleData.name !== role.name) {
            const existingRole = await RoleModel.findByName(roleData.name);
            if (existingRole) {
                throw new Error('Role name already exists');
            }
        }

        const updatedRole = await RoleModel.update(id, roleData);
        return updatedRole;
    },

    /**
     * Delete role
     */
    deleteRole: async (id) => {
        const role = await RoleModel.findById(id);
        if (!role) {
            throw new Error('Role not found');
        }

        await RoleModel.delete(id);
        return { message: 'Role deleted successfully' };
    }
};

module.exports = RoleService;
