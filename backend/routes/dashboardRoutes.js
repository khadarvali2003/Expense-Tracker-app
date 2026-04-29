const express = require('express');
const router = express.Router();
const {
  getMonthlySummary,
  getCategoryBreakdown,
  getDailyTrend,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/summary', getMonthlySummary);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/daily-trend', getDailyTrend);

module.exports = router;
