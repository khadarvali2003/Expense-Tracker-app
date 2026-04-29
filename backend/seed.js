/**
 * Database Seeder
 * Seeds the database with sample data for testing
 * Usage: npm run seed
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Expense = require('./models/Expense');

const sampleExpenses = [
  { amount: 250, category: 'Food', note: 'Lunch at restaurant', paymentMethod: 'UPI', daysAgo: 1 },
  { amount: 1500, category: 'Shopping', note: 'New shoes', paymentMethod: 'Card', daysAgo: 2 },
  { amount: 100, category: 'Travel', note: 'Auto rickshaw', paymentMethod: 'Cash', daysAgo: 3 },
  { amount: 2000, category: 'Bills', note: 'Electricity bill', paymentMethod: 'Net Banking', daysAgo: 4 },
  { amount: 500, category: 'Health', note: 'Medicine', paymentMethod: 'UPI', daysAgo: 5 },
  { amount: 350, category: 'Food', note: 'Groceries', paymentMethod: 'Cash', daysAgo: 6 },
  { amount: 800, category: 'Entertainment', note: 'Movie tickets', paymentMethod: 'UPI', daysAgo: 7 },
  { amount: 450, category: 'Food', note: 'Dinner', paymentMethod: 'Card', daysAgo: 8 },
  { amount: 3000, category: 'Education', note: 'Online course', paymentMethod: 'Net Banking', daysAgo: 9 },
  { amount: 200, category: 'Travel', note: 'Bus ticket', paymentMethod: 'Cash', daysAgo: 10 },
  { amount: 150, category: 'Food', note: 'Snacks & coffee', paymentMethod: 'UPI', daysAgo: 11 },
  { amount: 5000, category: 'Shopping', note: 'Birthday gift', paymentMethod: 'Card', daysAgo: 12 },
  { amount: 1200, category: 'Bills', note: 'Internet bill', paymentMethod: 'UPI', daysAgo: 13 },
  { amount: 300, category: 'Others', note: 'Charity donation', paymentMethod: 'Cash', daysAgo: 14 },
  { amount: 750, category: 'Health', note: 'Gym membership', paymentMethod: 'UPI', daysAgo: 15 },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Expense.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      currency: '₹',
      monthlyBudget: 20000,
    });
    console.log(`👤 Created test user: ${user.email}`);

    // Create expenses
    const expenses = sampleExpenses.map((exp) => ({
      user: user._id,
      amount: exp.amount,
      category: exp.category,
      note: exp.note,
      paymentMethod: exp.paymentMethod,
      date: new Date(Date.now() - exp.daysAgo * 24 * 60 * 60 * 1000),
    }));

    await Expense.insertMany(expenses);
    console.log(`💰 Created ${expenses.length} sample expenses`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
