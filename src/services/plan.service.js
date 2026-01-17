const PlanModel = require('../models/plan.model');

/**
 * Plan Service - Business logic for plan operations
 */
const PlanService = {
    /**
     * Get all plans
     */
    getAllPlans: async () => {
        const plans = await PlanModel.findAll();
        return plans;
    },

    /**
     * Get plan by ID
     */
    getPlanById: async (id) => {
        const plan = await PlanModel.findById(id);
        if (!plan) {
            throw new Error('Plan not found');
        }
        return plan;
    },

    /**
     * Create new plan
     */
    createPlan: async (planData) => {
        // Check uniqueness of stripe_id
        const existingPlan = await PlanModel.findByStripeId(planData.stripe_id);
        if (existingPlan) {
            throw new Error('Plan with this Stripe ID already exists');
        }

        const plan = await PlanModel.create(planData);
        return plan;
    },

    /**
     * Update plan
     */
    updatePlan: async (id, planData) => {
        const plan = await PlanModel.findById(id);
        if (!plan) {
            throw new Error('Plan not found');
        }

        const updatedPlan = await PlanModel.update(id, planData);
        return updatedPlan;
    },

    /**
     * Delete plan
     */
    deletePlan: async (id) => {
        const plan = await PlanModel.findById(id);
        if (!plan) {
            throw new Error('Plan not found');
        }

        await PlanModel.delete(id);
        return { message: 'Plan deleted successfully' };
    }
};

module.exports = PlanService;
