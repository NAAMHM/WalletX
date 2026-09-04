const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`
╔═══════════════════════════════════════╗
║     MONGODB CONNECTED SUCCESSFULLY    ║
╚═══════════════════════════════════════╝

  Host: ${conn.connection.host}
  Database: ${conn.connection.name}
  Port: ${conn.connection.port}
  Status: Connected
  
`);
  } catch (error) {
    console.error(`
╔═══════════════════════════════════════╗
║     MONGODB CONNECTION FAILED         ║
╚═══════════════════════════════════════╝

  Error: ${error.message}
  
  ⚠️  IMPORTANT:
  
  MongoDB connection failed. Please make sure:
  
  1. MongoDB is installed on your system
  2. MongoDB service is running locally
  3. Connection URI is correct: mongodb://127.0.0.1:27017/walletx
  
  To start MongoDB service:
  - Windows: Start MongoDB service from Services
  - macOS: brew services start mongodb-community
  - Linux: sudo systemctl start mongod
  
`);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✓ MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('✗ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('✗ MongoDB connection disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('\nMongoDB connection closed due to application termination');
  process.exit(0);
});

module.exports = connectDB;
