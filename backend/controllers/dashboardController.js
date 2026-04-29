const Expense = require('../models/Expense');

/**
 * @desc    Get monthly summary (total spent this month)
 * @route   GET /api/dashboard/summary
 * @access  Private
 * @query   month (1-12), year (YYYY)
 */
const getMonthlySummary = async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    // Start and end of the specified month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Previous month for comparison
    const prevStartDate = new Date(year, month - 2, 1);
    const prevEndDate = new Date(year, month - 1, 0, 23, 59, 59, 999);

    // Current month aggregate
    const [currentMonth] = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
          maxExpense: { $max: '$amount' },
          minExpense: { $min: '$amount' },
        },
      },
    ]);

    // Previous month aggregate for comparison
    const [previousMonth] = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: prevStartDate, $lte: prevEndDate },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent expenses (last 5)
    const recentExpenses = await Expense.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ date: -1 })
      .limit(5);

    // Calculate percentage change
    const currentTotal = currentMonth ? currentMonth.totalAmount : 0;
    const previousTotal = previousMonth ? previousMonth.totalAmount : 0;
    const percentageChange =
      previousTotal > 0
        ? (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        month,
        year,
        summary: {
          totalSpent: currentTotal,
          expenseCount: currentMonth ? currentMonth.count : 0,
          averageExpense: currentMonth
            ? Math.round(currentMonth.avgAmount * 100) / 100
            : 0,
          highestExpense: currentMonth ? currentMonth.maxExpense : 0,
          lowestExpense: currentMonth ? currentMonth.minExpense : 0,
        },
        comparison: {
          previousMonthTotal: previousTotal,
          percentageChange: parseFloat(percentageChange),
          trend: currentTotal > previousTotal ? 'up' : currentTotal < previousTotal ? 'down' : 'same',
        },
        recentExpenses,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get category-wise breakdown
 * @route   GET /api/dashboard/category-breakdown
 * @access  Private
 * @query   month (1-12), year (YYYY)
 */
const getCategoryBreakdown = async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const breakdown = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    // Calculate total for percentage
    const grandTotal = breakdown.reduce((sum, cat) => sum + cat.totalAmount, 0);

    // Add percentage to each category
    const categories = breakdown.map((cat) => ({
      category: cat._id,
      totalAmount: Math.round(cat.totalAmount * 100) / 100,
      count: cat.count,
      averageAmount: Math.round(cat.avgAmount * 100) / 100,
      percentage:
        grandTotal > 0
          ? Math.round((cat.totalAmount / grandTotal) * 10000) / 100
          : 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        month,
        year,
        grandTotal: Math.round(grandTotal * 100) / 100,
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get daily spending trend for the month
 * @route   GET /api/dashboard/daily-trend
 * @access  Private
 * @query   month (1-12), year (YYYY)
 */
const getDailyTrend = async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const dailyData = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Fill in missing days with zero
    const daysInMonth = new Date(year, month, 0).getDate();
    const trend = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = dailyData.find((d) => d._id === day);
      trend.push({
        day,
        date: new Date(year, month - 1, day).toISOString().split('T')[0],
        totalAmount: dayData ? dayData.totalAmount : 0,
        count: dayData ? dayData.count : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        month,
        year,
        trend,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMonthlySummary,
  getCategoryBreakdown,
  getDailyTrend,
};
