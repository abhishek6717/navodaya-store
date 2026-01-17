
import cartModel from '../models/cartModel.js';
import userModel from '../models/userModel.js';

export const addToCartController = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ success: false, message: 'Product ID and quantity are required' });
        }
        const { productId, quantity } = req.body;
        const userId = req.user._id;  
        let user = await userModel.findById(userId);
        if(!user){
            return res.status(404).send({ success: false, message: 'User not found' });
        }  
        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            cart = new cartModel({ userId, products: [] });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).send({ success: true, message: 'Product added to cart', cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error adding product to cart' });
    }
};

export const getCartController = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await cartModel.findOne({ userId }).populate('products.productId');
        if (!cart) {
            return res.status(404).send({ success: false, message: 'Cart not found' });
        }
        res.status(200).send({ success: true, cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error fetching cart' });
    }
};
 export const removeFromCartController = async (req, res) => {  
    try {
        const { productId } = req.params;
        const userId = req.user._id;
        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ success: false, message: 'Cart not found' });
        }
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            await cart.save();
            res.status(200).send({ success: true, message: 'Product removed from cart', cart });
        } else {
            res.status(404).send({ success: false, message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error removing product from cart' });
    }
};  


export const clearCartController = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ success: false, message: 'Cart not found' });
        }
        cart.products = [];
        await cart.save();  
        res.status(200).send({ success: true, message: 'Cart cleared', cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error clearing cart' });
    }
};

export const updateCartItemQtyController = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || quantity == null) {
            return res.status(400).send({ success: false, message: 'Product ID and quantity are required' });
        }
        const userId = req.user._id;
        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ success: false, message: 'Cart not found' });
        }
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();  
            res.status(200).send({ success: true, message: 'Cart item quantity updated', cart });
        } else {
            res.status(404).send({ success: false, message: 'Product not found in cart' });
        }   
    } catch (error) {
        console.error(error);
        res.status( 
            500).send({ success: false, message: 'Error updating cart item quantity' });
    }
};

export default { addToCartController, getCartController, removeFromCartController, clearCartController, updateCartItemQtyController };