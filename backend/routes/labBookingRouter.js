const express = require('express');
const {
  getLabTests,
  getTestById,
  bookLabTest,
  getAvailableLabs
} = require('../Controllers/labBookingController');
// const { optionalAuth } = require('../middleware/authMiddleware');
const { requireSignIn } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (optional authentication)
router.get('/tests', getLabTests);
router.get('/tests/:testId', getTestById);
router.get('/labs', getAvailableLabs);
router.post('/book', requireSignIn, bookLabTest);
// router.post('/book', optionalAuth, bookLabTest);

module.exports = router;