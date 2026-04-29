const Expense = require('../models/Expense');
const { validationResult } = require('express-validator');

/**
 * @desc    Create a new expense
 * @route   POST /api/expenses
 * @access  Private
 */
const createExpense = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { amount, category, date, note, paymentMethod } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      date: date || Date.now(),
      note: note || '',
      paymentMethod: paymentMethod || 'Cash',
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: { expense },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all expenses for logged-in user
 * @route   GET /api/expenses
 * @access  Private
 * @query   sort (latest|oldest|highest|lowest), category, startDate, endDate, page, limit
 */
const getExpenses = async (req, res, next) => {
  try {
    const {
      sort = 'latest',
      category,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      search,
    } = req.query;

    // Build query filter
    const filter = { user: req.user._id };

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Search in notes
    if (search) {
      filter.note = { $regex: search, $options: 'i' };
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'oldest':
        sortOption = { date: 1 };
        break;
      case 'highest':
        sortOption = { amount: -1 };
        break;
      case 'lowest':
        sortOption = { amount: 1 };
        break;
      case 'latest':
      default:
        sortOption = { date: -1 };
        break;
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Expense.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        expenses,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single expense by ID
 * @route   GET /api/expenses/:id
 * @access  Private
 */
const getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { expense },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an expense
 * @route   PUT /api/expenses/:id
 * @access  Private
 */
const updateExpense = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: { expense },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: { expense },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
};
