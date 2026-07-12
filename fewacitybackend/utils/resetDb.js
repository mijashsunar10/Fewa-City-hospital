import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const reset = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing from env');
      process.exit(1);
    }
    
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');

    // Clear departments and doctors collections
    console.log('Clearing departments collection...');
    await mongoose.connection.collection('departments').deleteMany({});
    console.log('Clearing doctors collection...');
    await mongoose.connection.collection('doctors').deleteMany({});

    console.log('Collections cleared successfully. They will auto-seed upon the next server request!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exit(1);
  }
};

reset();
