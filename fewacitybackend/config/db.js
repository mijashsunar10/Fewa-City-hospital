import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }
    
    console.log('Connecting to MongoDB Atlas database...');
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // Timeout connection attempt after 5 seconds
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Atlas Connection Failed: ${error.message}`);
    console.log('Attempting local MongoDB fallback (mongodb://127.0.0.1:27017/fewacity)...');
    
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/fewacity', {
        serverSelectionTimeoutMS: 3000 // Timeout local connection after 3 seconds
      });
      console.log(`✅ Connected to Local MongoDB fallback: ${conn.connection.host}`);
    } catch (localError) {
      console.error(`❌ Local MongoDB fallback connection also failed: ${localError.message}`);
      console.error('\n🛠️  MONGO DB CONNECTION TROUBLESHOOTING GUIDE:');
      console.error('===================================================');
      console.error('1. IP Address Whitelisting (MongoDB Atlas):');
      console.error('   - Log in to cloud.mongodb.com');
      console.error('   - Go to "Network Access" under Security.');
      console.error('   - Click "Add IP Address" -> Click "ADD CURRENT IP ADDRESS" or select "Allow Access from Anywhere" (0.0.0.0/0) for testing.');
      console.error('2. Local MongoDB Service:');
      console.error('   - Ensure your local MongoDB database service is active:');
      console.error('     Linux:   sudo systemctl start mongod');
      console.error('     Windows: Run services.msc and start the "MongoDB Server" service');
      console.error('3. Environment Variables:');
      console.error('   - Verify that your MONGO_URI in fewacitybackend/.env is set up correctly.');
      console.error('===================================================\n');
      process.exit(1);
    }
  }
};

export default connectDB;
