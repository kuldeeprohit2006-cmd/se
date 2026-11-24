const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const storage = require('../services/storageService');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mediguard_super_secret_jwt_key_2024');

      if (mongoose.connection && mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        req.user = storage.findUserById(decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found. Token invalid.' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized. Token expired or invalid.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. No token provided.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
  }
};

module.exports = { protect, adminOnly };
