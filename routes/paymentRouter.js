import express from 'express';
import { generateTokenController, processPaymentController } from '../controllers/paymentController.js';
import { requireSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/get-token', requireSignIn, generateTokenController);
router.post('/process-payment', requireSignIn, processPaymentController);

export default router;
