import express from 'express';
import { 
  getServices, 
  createService, 
  updateService, 
  deleteService 
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getServices);

// Protected admin routes
router.post('/', protect, upload.single('image'), createService);
router.put('/:id', protect, upload.single('image'), updateService);
router.delete('/:id', protect, deleteService);

export default router;
