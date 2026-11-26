const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Ensure .env is always loaded from server directory
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const dbReadyPromise = connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Ensure initial MongoDB connection attempt settles once per cold start
app.use(async (req, res, next) => {
  try {
    await dbReadyPromise;
  } catch {
    // storageService fallback handles DB-unavailable periods
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ambulance', require('./routes/ambulanceRoutes'));
app.use('/api/blood', require('./routes/bloodRoutes'));
app.use('/api/firstaid', require('./routes/firstAidRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/incidents', require('./routes/incidentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health checks (handles both direct root and /api service proxy paths)
app.get(['/', '/api'], (req, res) => {
  res.json({ message: '🚨 MediGuard API is running!', status: 'OK' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL && require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 MediGuard Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
