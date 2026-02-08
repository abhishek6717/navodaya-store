import express from 'express';
import {
    getUserOrdersController,
    getAllOrdersController,
    updateOrderStatusController
 } from '../controllers/orderController.js';
import { requireSignIn, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user-orders', requireSignIn, getUserOrdersController);
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);
router.put('/update-order-status/:orderId', requireSignIn, isAdmin, updateOrderStatusController)    

export default router;
