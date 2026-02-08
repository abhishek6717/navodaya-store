import Order from '../models/orderModel.js';

export const getUserOrdersController = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ status: false, message: 'Unauthorized' });

    const orders = await Order.find({ buyer: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ status: true, orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ status: false, message: 'Failed to fetch orders' });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ status: true, orders });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return res.status(500).json({ status: false, message: 'Failed to fetch orders' });
  }
  
};

export const updateOrderStatusController = async (req, res) => {  
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!orderId) return res.status(400).json({ status: false, message: 'Order ID is required' });
    if (!status) return res.status(400).json({ status: false, message: 'Status is required' });
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ status: false, message: 'Order not found' });
    return res.status(200).json({ status: true, message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ status: false, message: 'Failed to update order status' });
  }   
  
};

export default {
  getUserOrdersController,
  getAllOrdersController,
  updateOrderStatusController
};
