import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
      name: String,
      price: Number,
      qty: Number,
    },
  ],
  payment: {
    transactionId: String,
    amount: Number,
    status: String,
    raw: {}
  },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  status: { type: String, default: 'Not processed' },
}, { timestamps: true });

const Order = mongoose.model('order', orderSchema);
export default Order;
