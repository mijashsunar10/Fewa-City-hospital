import express from 'express';
import {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage
} from '../controllers/messageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for contact form submission
router.post('/', createMessage);

// Protected admin routes for retrieving/managing messages
router.get('/', protect, admin, getMessages);
router.put('/:id/read', protect, admin, markAsRead);
router.delete('/:id', protect, admin, deleteMessage);

export default router;
