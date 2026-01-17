const db = require('../config/db');

/**
 * User Model - Database operations for users
 */
const UserModel = {
    /**
     * Find user by ID
     */
    findById: async (id) => {
        const result = await db.query(
            'SELECT id, username, email, full_name, role, created_at, updated_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    /**
     * Find user by email
     */
    findByEmail: async (email) => {
        const result = await db.query(
            `
    SELECT
      u.id,
      u.email,
      u.password_hash,
      u.first_name,
      u.last_name,
      u.domain,
      u.designation,
      u.joining_date,
      u.employment_type,
      u.contract_type,
      u.timezone,
      u.is_verified,
      u.payment_type,
      u.currency,
      u.payment_amount,
      u.picture,
      u.is_staff,
      u.is_superuser,
      u.is_app_logged_in,
      u.is_primary_admin,
      u.created_at,
      u.updated_at,

      -- Role object
      json_build_object(
        'id', r.id,
        'name', r.name
      ) AS role,

      -- Plan object
      json_build_object(
        'id', p.id,
        'name', p.name,
        'description', p.description,
        'number_of_users', p.number_of_users,
        'amount', p.amount,
        'currency', p.currency,
        'billing_interval', p.billing_interval,
        'trial_period_days', p.trial_period_days,
        'is_enterprise', p.is_enterprise,
        'is_promotional', p.is_promotional
      ) AS plan

    FROM users u
    LEFT JOIN roles r ON u.role = r.id
    LEFT JOIN plans p ON u.plans = p.id
    WHERE u.email = $1
    LIMIT 1
    `,
            [email]
        );

        return result.rows[0];
    },


    /**
     * Get all users with pagination
     */
    findAll: async (limit, offset) => {
        const result = await db.query(
            'SELECT id, username, email, full_name, role, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        return result.rows;
    },

    /**
     * Count total users
     */
    count: async () => {
        const result = await db.query('SELECT COUNT(*) FROM users');
        return parseInt(result.rows[0].count);
    },

    /**
     * Create new user
     */
    create: async (userData) => {
        const { email, password_hash, first_name, last_name, domain, role, plan } = userData;
        const result = await db.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, domain, role, plans) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, email, first_name, last_name, domain, role, plans, created_at, updated_at`,
            [email, password_hash, first_name, last_name, domain, role, plan]
        );
        return result.rows[0];
    },

    /**
 * Update user (SAFE)
 */
    update: async (id, userData) => {
        const allowedFields = [
            'email',
            'first_name',
            'last_name',
            'domain',
            'designation',
            'joining_date',
            'employment_type',
            'contract_type',
            'otp_code',
            'timezone',
            'is_verified',
            'payment_type',
            'currency',
            'payment_amount',
            'picture',
            'is_staff',
            'is_superuser',
            'is_app_logged_in',
            'is_primary_admin',
            'role',
            'plans'
        ];

        // Map plan to plans if present
        if (userData.plan) {
            userData.plans = userData.plan;
        }

        const fields = [];
        const values = [];
        let paramCount = 1;

        for (const key of allowedFields) {
            if (userData[key] !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(userData[key]);
                paramCount++;
            }
        }

        if (fields.length === 0) {
            return null;
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');

        values.push(id);

        const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING 
      id,
      email,
      first_name,
      last_name,
      domain,
      role,
      created_at,
      updated_at
  `;

        const result = await db.query(query, values);
        return result.rows[0];
    },


    /**
     * Delete user
     */
    delete: async (id) => {
        const result = await db.query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    },

    /**
     * Update password
     */
    updatePassword: async (id, password_hash) => {
        const result = await db.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
            [password_hash, id]
        );
        return result.rows[0];
    }
};

module.exports = UserModel;
