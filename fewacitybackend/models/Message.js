import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email address'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please add message content'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
