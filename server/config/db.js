const mongoose = require('mongoose');

const DEFAULT_MONGO_URI = 'mongodb+srv://kuldeeprohit2006_db_user:pKqXVjPHQoJ3f0kw@cluster0.3pozljj.mongodb.net/mediguard';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      family: 4 // Use IPv4, avoid IPv6 DNS timeout on Windows
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.log('🔄 Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
