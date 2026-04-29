const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Verify JWT token
 * Extracts token from Authorization header (Bearer <token>)
 * Attaches user object to req.user
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired, please login again',
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = { protect, generateToken };
