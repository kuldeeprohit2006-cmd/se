const mongoose = require('mongoose');

const DEFAULT_MONGO_URI = 'mongodb+srv://kuldeeprohit2006_db_user:pKqXVjPHQoJ3f0kw@cluster0.3pozljj.mongodb.net/mediguard';

let retryTimer = null;

const connectDB = async () => {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const uri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: process.env.VERCEL ? 2500 : 4000,
      family: 4
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    // Only schedule background retries on persistent servers, not ephemeral serverless invocations
    if (!process.env.VERCEL && !retryTimer) {
      retryTimer = setTimeout(() => {
        retryTimer = null;
        connectDB();
      }, 10000);
    }
    return null;
  }
};

module.exports = connectDB;
