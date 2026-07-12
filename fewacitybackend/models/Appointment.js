import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please select a date'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please select a time slot'],
    },
    symptoms: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    prescription: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Pending', 'Paid'],
      default: 'Unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['None', 'Khalti', 'eSewa'],
      default: 'None',
    },
    amount: {
      type: Number,
      default: 0,
    },
    khaltiPidx: {
      type: String,
      default: '',
    },
    khaltiTransactionId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
