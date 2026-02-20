const express = require('express');
const router = express.Router();
const { getPublicStats, getHomepageStats } = require('../Controllers/statsController');


router.get('/public/stats', getPublicStats);
router.get('/public/homepage-stats', getHomepageStats);

module.exports = router;