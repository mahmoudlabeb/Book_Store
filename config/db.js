const mongoose = require('mongoose');

require('events').defaultMaxListeners = 20;

const connectDB = async () => {
  try {
    const uri = 'mongodb://127.0.0.1:27017/bookstore';
    await mongoose.connect(uri, {});
    console.log('Connected successfully to server');
  } catch (error) {
    console.error('connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
