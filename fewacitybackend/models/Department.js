import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a department title'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Please add a department slug'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a department description'],
      trim: true,
    },
    extra: {
      type: String,
      trim: true,
      default: '',
    },
    points: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model('Department', departmentSchema);
export default Department;
