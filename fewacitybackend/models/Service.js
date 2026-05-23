import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a service title'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
      enum: ['Diagnostics', 'Critical Care', 'Specialized Treatment', 'General'],
      default: 'General',
    },
    image: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      required: [true, 'Please add a service description'],
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
