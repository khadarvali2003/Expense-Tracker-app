const mongoose = require('mongoose');

const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Education',
  'Others',
];

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be at least 0.01'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(', ')}`,
      },
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, 'Note cannot exceed 200 characters'],
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Net Banking', 'Other'],
      default: 'Cash',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

// Static method to get categories
expenseSchema.statics.getCategories = function () {
  return CATEGORIES;
};

module.exports = mongoose.model('Expense', expenseSchema);
module.exports.CATEGORIES = CATEGORIES;
