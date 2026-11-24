const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Ensure .env is always loaded from server directory
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ambulance', require('./routes/ambulanceRoutes'));
app.use('/api/blood', require('./routes/bloodRoutes'));
app.use('/api/firstaid', require('./routes/firstAidRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/incidents', require('./routes/incidentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/', (req, res) => {
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
app.listen(PORT, () => {
  console.log(`🚀 MediGuard Server running on http://localhost:${PORT}`);
});
