const express = require('express');
const router = express.Router();
const { requireSignIn } = require('../middleware/authMiddleware'); // Make sure this exists
const {
  submitReview,
  getReviews,
  canReview
} = require('../Controllers/reviewController');

// Public routes (no auth needed to view reviews)
router.get('/:targetType/:targetId', getReviews);

// Protected routes (require login)
router.post('/', requireSignIn, submitReview); // This should be protected
router.get('/check/:targetType/:targetId', requireSignIn, canReview);

module.exports = router;