const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const https = require('https');
const selfsigned = require('selfsigned');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
});

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Expense Tracker API is running',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      expenses: '/api/expenses',
      dashboard: '/api/dashboard',
    },
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Expense Tracker API Documentation',
    version: '1.0.0',
    baseUrl: '/api',
    endpoints: {
      authentication: {
        'POST /api/auth/register': {
          description: 'Register a new user',
          body: { name: 'string', email: 'string', password: 'string' },
          access: 'Public',
        },
        'POST /api/auth/login': {
          description: 'Login user',
          body: { email: 'string', password: 'string' },
          access: 'Public',
        },
        'GET /api/auth/profile': {
          description: 'Get user profile',
          access: 'Private (Bearer token)',
        },
        'PUT /api/auth/profile': {
          description: 'Update user profile',
          body: { name: 'string?', currency: 'string?', monthlyBudget: 'number?' },
          access: 'Private (Bearer token)',
        },
        'PUT /api/auth/change-password': {
          description: 'Change password',
          body: { currentPassword: 'string', newPassword: 'string' },
          access: 'Private (Bearer token)',
        },
      },
      expenses: {
        'POST /api/expenses': {
          description: 'Create expense',
          body: {
            amount: 'number (required)',
            category: 'Food|Travel|Shopping|Bills|Health|Entertainment|Education|Others',
            date: 'ISO date string',
            note: 'string (max 200)',
            paymentMethod: 'Cash|Card|UPI|Net Banking|Other',
          },
          access: 'Private',
        },
        'GET /api/expenses': {
          description: 'List expenses',
          query: 'sort, category, startDate, endDate, page, limit, search',
          access: 'Private',
        },
        'GET /api/expenses/:id': { description: 'Get single expense', access: 'Private' },
        'PUT /api/expenses/:id': { description: 'Update expense', access: 'Private' },
        'DELETE /api/expenses/:id': { description: 'Delete expense', access: 'Private' },
      },
      dashboard: {
        'GET /api/dashboard/summary': {
          description: 'Monthly summary with comparison',
          query: 'month (1-12), year (YYYY)',
          access: 'Private',
        },
        'GET /api/dashboard/category-breakdown': {
          description: 'Category-wise spending breakdown',
          query: 'month (1-12), year (YYYY)',
          access: 'Private',
        },
        'GET /api/dashboard/daily-trend': {
          description: 'Daily spending trend',
          query: 'month (1-12), year (YYYY)',
          access: 'Private',
        },
      },
    },
  });
});

// ============================================
// ERROR HANDLING
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// SERVER START
// ============================================
const PORT = process.env.PORT || 5000;

// Generate self-signed certificate for local HTTPS
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });
const httpsOptions = {
  key: pems.private,
  cert: pems.cert,
};

const server = https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║     💰 Expense Tracker API Server        ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║  🌍 Environment: ${process.env.NODE_ENV || 'development'}`.padEnd(44) + '║');
  console.log(`║  🚀 Port: ${PORT}`.padEnd(44) + '║');
  console.log(`║  📡 URL: https://localhost:${PORT}`.padEnd(44) + '║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
