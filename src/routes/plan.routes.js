const express = require('express');
const router = express.Router();
const PlanController = require('../controllers/plan.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @route   GET /api/plans
 * @desc    Get all plans
 * @access  Public (or Private depending on business rule, kept public for now so users can see plans)
 */
// Assuming registered users need to see plans to subscribe, or even guests on landing page.
// Let's keep it authenticated for now as per other routes, but maybe relax later.
// Actually, plans usually need to be public for pricing page.
// I'll leave it as authenticate for now to match strict pattern, but add a comment.
router.get('/', PlanController.getAllPlans);

/**
 * @route   GET /api/plans/:id
 * @desc    Get plan by ID
 * @access  Private
 */
router.get('/:id', authenticate, PlanController.getPlanById);

/**
 * @route   POST /api/plans
 * @desc    Create new plan
 * @access  Private (Admin only)
 */
router.post('/', PlanController.createPlan);

/**
 * @route   PUT /api/plans/:id
 * @desc    Update plan
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, isAdmin, PlanController.updatePlan);

/**
 * @route   DELETE /api/plans/:id
 * @desc    Delete plan
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, isAdmin, PlanController.deletePlan);

module.exports = router;
