import express from 'express';
import { 
  initiateKhaltiPayment, 
  verifyKhaltiPayment,
  initiateStripePayment,
  verifyStripePayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to initiate payment via Khalti
router.post('/khalti/initiate', protect, initiateKhaltiPayment);

// Route to verify payment via Khalti
router.post('/khalti/verify', protect, verifyKhaltiPayment);

// Route to initiate payment via Stripe
router.post('/stripe/initiate', protect, initiateStripePayment);

// Route to verify payment via Stripe
router.post('/stripe/verify', protect, verifyStripePayment);

export default router;
