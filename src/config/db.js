const mongoose = require('mongoose');

async function connectDb(uri) {
  if (!uri) throw new Error('MongoDB URI not provided');
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error', err);
    throw err;
  }
}

module.exports = { connectDb };
