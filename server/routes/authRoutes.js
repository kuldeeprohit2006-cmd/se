const express = require('express');
const router = express.Router();
const { register, login, googleAuth, getMe, seedDemoAccounts } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/seed', seedDemoAccounts);
router.get('/me', protect, getMe);

module.exports = router;
