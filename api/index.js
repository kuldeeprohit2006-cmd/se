const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const connectDB = require('../server/config/db');
const dbReadyPromise = connectDB();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Ensure initial MongoDB connection attempt settles once before route handlers execute
app.use(async (req, res, next) => {
  try {
    await dbReadyPromise;
  } catch {
    // storageService fallback handles DB-unavailable periods
  }
  next();
});

// Mount API routes
app.use('/api/auth', require('../server/routes/authRoutes'));
app.use('/api/ambulance', require('../server/routes/ambulanceRoutes'));
app.use('/api/blood', require('../server/routes/bloodRoutes'));
app.use('/api/firstaid', require('../server/routes/firstAidRoutes'));
app.use('/api/medicines', require('../server/routes/medicineRoutes'));
app.use('/api/incidents', require('../server/routes/incidentRoutes'));
app.use('/api/admin', require('../server/routes/adminRoutes'));

app.get('/api', (req, res) => {
  res.json({ message: '🚨 MediGuard Serverless API on Vercel is running!', status: 'OK' });
});

// 404 handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

module.exports = app;
