import express from 'express';
import { getUserOrdersController, getAllOrdersController } from '../controllers/orderController.js';
import { requireSignIn, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user-orders', requireSignIn, getUserOrdersController);
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

export default router;
