import express from 'express';
import { 
  getDoctors, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor,
  getDoctorById
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getDoctors);
router.get('/:id', getDoctorById);

// Protected admin routes
router.post('/', protect, upload.single('image'), createDoctor);
router.put('/:id', protect, upload.single('image'), updateDoctor);
router.delete('/:id', protect, deleteDoctor);

export default router;
