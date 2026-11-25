const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const storage = require('../services/storageService');

const buildUserFromToken = (decoded) => {
  if (!decoded?.email) return null;
  return {
    _id: decoded.id,
    email: decoded.email,
    name: decoded.name || decoded.email.split('@')[0],
    role: decoded.role || 'student',
    college: decoded.college || 'IIIT Lucknow',
    branch: decoded.branch || 'General',
    branchCode: decoded.branchCode || 'general',
    rollNo: decoded.rollNo || '',
    batch: decoded.batch || '2025',
    campusLocation: decoded.campusLocation || 'Boys Hostel 1'
  };
};

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. No token provided.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mediguard_super_secret_jwt_key_2024');

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      req.user = await User.findById(decoded.id).select('-password');
    }

    if (!req.user) {
      req.user = storage.findUserById(decoded.id) || buildUserFromToken(decoded);
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not found. Token invalid.' });
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Not authorized. Token expired or invalid.' });
  }
};

const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mediguard_super_secret_jwt_key_2024');
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      }
      if (!req.user) {
        req.user = storage.findUserById(decoded.id) || buildUserFromToken(decoded);
      }
    } catch {
      // Allow anonymous SOS submission on emergency endpoint
    }
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
  }
};

module.exports = { protect, optionalProtect, adminOnly };
