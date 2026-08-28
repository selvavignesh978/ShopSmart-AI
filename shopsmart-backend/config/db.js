const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri || typeof mongoUri !== 'string') {
      throw new Error(
        'MONGO_URI is undefined or not configured in environment variables. Please add MONGO_URI in your .env or platform settings.'
      );
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;