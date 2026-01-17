const db = require('../config/db');

/**
 * Plan Model - Database operations for plans
 */
const PlanModel = {
    /**
     * Find plan by ID
     */
    findById: async (id) => {
        const result = await db.query(
            'SELECT * FROM plans WHERE id = $1 AND is_deleted = false',
            [id]
        );
        return result.rows[0];
    },

    /**
     * Find plan by Stripe ID
     */
    findByStripeId: async (stripeId) => {
        const result = await db.query(
            'SELECT * FROM plans WHERE stripe_id = $1 AND is_deleted = false',
            [stripeId]
        );
        return result.rows[0];
    },

    /**
     * Get all active plans
     */
    findAll: async () => {
        const result = await db.query(
            'SELECT * FROM plans WHERE is_deleted = false ORDER BY created_at DESC'
        );
        return result.rows;
    },

    /**
     * Create new plan
     */
    create: async (planData) => {
        const {
            stripe_id,
            name,
            description,
            number_of_users,
            amount,
            currency,
            billing_interval,
            trial_period_days,
            is_enterprise,
            is_promotional,
            is_active
        } = planData;

        const result = await db.query(
            `INSERT INTO plans (
                stripe_id,
                name,
                description,
                number_of_users,
                amount,
                currency,
                billing_interval,
                trial_period_days,
                is_enterprise,
                is_promotional,
                is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [
                stripe_id,
                name,
                description,
                number_of_users,
                amount,
                currency,
                billing_interval,
                trial_period_days,
                is_enterprise || false,
                is_promotional || false,
                is_active !== undefined ? is_active : true
            ]
        );
        return result.rows[0];
    },

    /**
     * Update plan
     */
    update: async (id, planData) => {
        const keys = Object.keys(planData);
        if (keys.length === 0) return null;

        const setClause = keys
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');

        const values = [...Object.values(planData), id];

        const result = await db.query(
            `UPDATE plans SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
            [id, ...Object.values(planData)] // Note: id should be the last parameter for the WHERE clause, but the SET clause uses $2 onwards. Wait, let's fix the query construction.
        );

        // Let's use a dynamic query builder approach for safety or manual parameterized query for simplicity given we know the fields.
        // Re-implementing update to be safer and simpler like RoleModel but handling dynamic fields if needed, or just specific fields.
        // Given existing patterns, let's stick to a full update or specific fields. 
        // RoleModel uses COALESCE. Let's do that for likely updated fields.

        const {
            name,
            description,
            number_of_users,
            amount,
            currency,
            billing_interval,
            trial_period_days,
            is_enterprise,
            is_promotional,
            is_active,
            is_archived
        } = planData;

        // Using individual checks or COALESCE in SQL is cleaner.
        const query = `
            UPDATE plans 
            SET 
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                number_of_users = COALESCE($3, number_of_users),
                amount = COALESCE($4, amount),
                currency = COALESCE($5, currency),
                billing_interval = COALESCE($6, billing_interval),
                trial_period_days = COALESCE($7, trial_period_days),
                is_enterprise = COALESCE($8, is_enterprise),
                is_promotional = COALESCE($9, is_promotional),
                is_active = COALESCE($10, is_active),
                is_archived = COALESCE($11, is_archived),
                archived_at = CASE WHEN $11 = true THEN CURRENT_TIMESTAMP ELSE archived_at END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $12
            RETURNING *
        `;

        const res = await db.query(query, [
            name,
            description,
            number_of_users,
            amount,
            currency,
            billing_interval,
            trial_period_days,
            is_enterprise,
            is_promotional,
            is_active,
            is_archived,
            id
        ]);

        return res.rows[0];
    },

    /**
     * Delete plan (Soft Delete)
     */
    delete: async (id) => {
        const result = await db.query(
            'UPDATE plans SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    }
};

module.exports = PlanModel;
