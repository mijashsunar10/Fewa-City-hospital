import express from 'express';
import { initiateKhaltiPayment, verifyKhaltiPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to initiate payment via Khalti
router.post('/khalti/initiate', protect, initiateKhaltiPayment);

// Route to verify payment via Khalti
router.post('/khalti/verify', protect, verifyKhaltiPayment);

export default router;
