const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const storage = require('../services/storageService');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'mediguard_super_secret_jwt_key_2024', { expiresIn: '7d' });
};

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, college, phone, campusLocation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const iiitlInfo = User.parseIIITLEmail(cleanEmail);
    const isAdmin = cleanEmail.startsWith('admin@') || cleanEmail === 'admin@iiitl.ac.in';

    const userData = {
      name,
      email: cleanEmail,
      college: college || (iiitlInfo ? 'IIIT Lucknow' : 'Campus Emergency Cell'),
      role: isAdmin ? 'admin' : 'student',
      phone: phone || '',
      campusLocation: campusLocation || 'Boys Hostel 1',
      authProvider: 'local'
    };

    if (iiitlInfo) {
      userData.branch = iiitlInfo.branch;
      userData.branchCode = iiitlInfo.branchCode;
      userData.batch = iiitlInfo.batch;
      userData.rollNo = iiitlInfo.rollNo;
    }

    let user;

    if (isDbConnected()) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      user = await User.create({ ...userData, password });
    } else {
      // Storage fallback
      const existing = storage.findUserByEmail(cleanEmail);
      if (existing) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = storage.addUser({ ...userData, password: hashedPassword });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        branch: user.branch || 'General',
        branchCode: user.branchCode || 'general',
        rollNo: user.rollNo || '',
        batch: user.batch || '2025',
        phone: user.phone || '',
        campusLocation: user.campusLocation,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user;
    let isMatch = false;

    if (isDbConnected()) {
      user = await User.findOne({ email: cleanEmail }).select('+password');
      if (user) {
        isMatch = await user.matchPassword(password);
      }
    }

    // Check storage if not found in db or db unavailable
    if (!user) {
      const fallbackUser = storage.findUserByEmail(cleanEmail);
      if (fallbackUser) {
        user = fallbackUser;
        isMatch = await bcrypt.compare(password, fallbackUser.password);
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        branch: user.branch || 'General',
        branchCode: user.branchCode || 'general',
        rollNo: user.rollNo || '',
        batch: user.batch || '2025',
        phone: user.phone || '',
        campusLocation: user.campusLocation,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Google OAuth Sign-In / Up
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required for Google authentication' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const iiitlInfo = User.parseIIITLEmail(cleanEmail);
    const isAdmin = cleanEmail.startsWith('admin@') || cleanEmail === 'admin@iiitl.ac.in';

    let user;

    if (isDbConnected()) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = storage.findUserByEmail(cleanEmail);
    }

    if (!user) {
      const userData = {
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        googleId: googleId || `g_${Date.now()}`,
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
        role: isAdmin ? 'admin' : 'student',
        college: iiitlInfo ? 'IIIT Lucknow' : 'Student Community',
        authProvider: 'google',
        campusLocation: 'Boys Hostel 1',
        branch: iiitlInfo ? iiitlInfo.branch : 'General',
        branchCode: iiitlInfo ? iiitlInfo.branchCode : 'general',
        batch: iiitlInfo ? iiitlInfo.batch : '2025',
        rollNo: iiitlInfo ? iiitlInfo.rollNo : ''
      };

      if (isDbConnected()) {
        user = await User.create(userData);
      } else {
        user = storage.addUser(userData);
      }
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        branch: user.branch || 'General',
        branchCode: user.branchCode || 'general',
        rollNo: user.rollNo || '',
        batch: user.batch || '2025',
        avatar: user.avatar,
        phone: user.phone || '',
        campusLocation: user.campusLocation,
        authProvider: 'google'
      }
    });
  } catch (error) {
    console.error('Google auth error:', error.message);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    let user;
    if (isDbConnected()) {
      user = await User.findById(req.user._id);
    }
    if (!user) {
      user = storage.findUserById(req.user._id) || req.user;
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Seed demo accounts
// @route   POST /api/auth/seed
const seedDemoAccounts = async (req, res) => {
  res.json({
    success: true,
    message: 'Accounts ready for immediate access',
    accounts: [
      { email: 'admin@iiitl.ac.in', role: 'admin', branch: 'General', rollNo: 'ADMIN' },
      { email: 'lcs2025044@iiitl.ac.in', role: 'student', branch: 'CS', rollNo: '044' },
      { email: 'lit2025012@iiitl.ac.in', role: 'student', branch: 'IT', rollNo: '012' },
      { email: 'lci2025033@iiitl.ac.in', role: 'student', branch: 'CSAI', rollNo: '033' },
      { email: 'lcb2025007@iiitl.ac.in', role: 'student', branch: 'CSB', rollNo: '007' }
    ]
  });
};

module.exports = {
  register,
  login,
  googleAuth,
  getMe,
  seedDemoAccounts
};
