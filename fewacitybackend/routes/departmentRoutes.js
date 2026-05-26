import express from 'express';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../controllers/departmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getDepartments);

// Protected admin routes
router.post('/', protect, upload.single('image'), createDepartment);
router.put('/:id', protect, upload.single('image'), updateDepartment);
router.delete('/:id', protect, deleteDepartment);

export default router;
