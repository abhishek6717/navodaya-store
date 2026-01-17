import express from 'express';

import {
        addToCartController,
        getCartController,
        removeFromCartController,
        clearCartController,
        updateCartItemQtyController 
    } from '../controllers/cartController.js';

import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/add-to-cart', requireSignIn, addToCartController);
router.get('/get-cart', requireSignIn, getCartController);
router.delete('/remove-from-cart/:productId', requireSignIn, removeFromCartController);
router.delete('/clear-cart', requireSignIn, clearCartController);
router.put('/update-cart-item-qty', requireSignIn, updateCartItemQtyController);

export default router;