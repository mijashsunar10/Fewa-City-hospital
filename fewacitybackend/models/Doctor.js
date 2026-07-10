import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a doctor name'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Please add qualifications'],
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Please select a department'],
    },
    image: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '9765940555', // Default WhatsApp number if none is given
    },
    experience: {
      type: String,
      default: '',
    },
    biography: {
      type: String,
      default: '',
    },
    schedule: {
      type: String,
      default: '',
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    workingStart: {
      type: String,
      default: '09:00 AM',
    },
    workingEnd: {
      type: String,
      default: '05:00 PM',
    }
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
