const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');
const {
  expenseValidation,
  expenseUpdateValidation,
  mongoIdValidation,
} = require('../middleware/validators');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getExpenses)
  .post(expenseValidation, createExpense);

router.route('/:id')
  .get(mongoIdValidation, getExpense)
  .put(mongoIdValidation, expenseUpdateValidation, updateExpense)
  .delete(mongoIdValidation, deleteExpense);

module.exports = router;
