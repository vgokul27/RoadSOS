require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB Connection...');
console.log('MONGO_URI from .env:', process.env.MONGO_URI);
console.log('Port from .env:', process.env.PORT);
console.log('Node ENV:', process.env.NODE_ENV);

const connectDB = async () => {
  try {
    console.log('\nAttempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log('✅ MongoDB Connected');
    process.exit(0);
  } catch (error) {
    console.error(`✗ Connection Error: ${error.message}`);
    console.error('Make sure:');
    console.error('1. MongoDB Atlas cluster is active');
    console.error('2. Your IP is whitelisted in MongoDB Atlas');
    console.error('3. Username and password are correct');
    console.error('4. .env file is in the server directory');
    process.exit(1);
  }
};

connectDB();
