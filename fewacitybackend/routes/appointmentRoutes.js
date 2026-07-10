import express from 'express';
import {
  createAppointment,
  getPatientAppointments,
  cancelAppointment,
  getAppointments,
  updateAppointment,
  getBookedSlots,
} from '../controllers/appointmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Patient routes (requires user registration/login)
router.post('/', protect, createAppointment);
router.get('/my', protect, getPatientAppointments);
router.put('/:id/cancel', protect, cancelAppointment);
router.get('/booked-slots', protect, getBookedSlots);

// Admin-only routes
router.get('/', protect, admin, getAppointments);
router.put('/:id', protect, admin, updateAppointment);

export default router;
