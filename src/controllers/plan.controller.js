const PlanService = require('../services/plan.service');
const { sendSuccess } = require('../helpers/response.helper');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');
const { createPlanSchema, updatePlanSchema } = require('../validators/plan.validator');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

/**
 * Plan Controller
 */
const PlanController = {
    /**
     * Get all plans
     * GET /api/plans
     */
    getAllPlans: asyncHandler(async (req, res) => {
        const plans = await PlanService.getAllPlans();

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Plans retrieved successfully',
            plans
        );
    }),

    /**
     * Get plan by ID
     * GET /api/plans/:id
     */
    getPlanById: asyncHandler(async (req, res) => {
        const plan = await PlanService.getPlanById(req.params.id);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Plan retrieved successfully',
            plan
        );
    }),

    /**
     * Create new plan
     * POST /api/plans
     */
    createPlan: asyncHandler(async (req, res) => {
        const { error } = createPlanSchema.validate(req.body);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.details[0].message
            });
        }

        const plan = await PlanService.createPlan(req.body);

        logger.info(`New plan created: ${plan.name}`);

        return sendSuccess(
            res,
            HTTP_STATUS.CREATED,
            SUCCESS_MESSAGES.CREATED,
            plan
        );
    }),

    /**
     * Update plan
     * PUT /api/plans/:id
     */
    updatePlan: asyncHandler(async (req, res) => {
        const { error } = updatePlanSchema.validate(req.body);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.details[0].message
            });
        }

        const plan = await PlanService.updatePlan(req.params.id, req.body);

        logger.info(`Plan updated: ${plan.id}`);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            SUCCESS_MESSAGES.UPDATED,
            plan
        );
    }),

    /**
     * Delete plan
     * DELETE /api/plans/:id
     */
    deletePlan: asyncHandler(async (req, res) => {
        const result = await PlanService.deletePlan(req.params.id);

        logger.info(`Plan deleted: ${req.params.id}`);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            SUCCESS_MESSAGES.DELETED,
            result
        );
    })
};

module.exports = PlanController;
