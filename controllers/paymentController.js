import braintree from 'braintree';
import Order from '../models/orderModel.js';
import productModel from '../models/productModel.js';

// Lazy-init Braintree gateway so missing env vars don't crash the app at import time.
let gateway = null;
const initGateway = () => {
  if (gateway) return gateway;
  const env = process.env.BRAINTREE_ENVIRONMENT || 'Sandbox';
  const merchantId = process.env.BRAINTREE_MERCHANT_ID;
  const publicKey = process.env.BRAINTREE_PUBLIC_KEY;
  const privateKey = process.env.BRAINTREE_PRIVATE_KEY;

  if (!merchantId || !publicKey || !privateKey) {
    console.error('Braintree configuration missing. Please set BRAINTREE_MERCHANT_ID, BRAINTREE_PUBLIC_KEY, BRAINTREE_PRIVATE_KEY in your environment.');
    return null;
  }

  try {
    gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment[env],
      merchantId,
      publicKey,
      privateKey,
    });
    return gateway;
  } catch (err) {
    console.error('Failed to initialize Braintree gateway:', err.message || err);
    return null;
  }
};

export const generateTokenController = async (req, res) => {
  try {
    const gw = initGateway();
    if (!gw) return res.status(500).json({ status: false, message: 'Braintree not configured on server' });

    const response = await gw.clientToken.generate({});
    return res.status(200).json({ status: true, clientToken: response.clientToken });
  } catch (error) {
    console.error('Braintree token error', error);
    return res.status(500).json({ status: false, message: 'Failed to generate client token' });
  }
};

export const processPaymentController = async (req, res) => {
  try {
    const gw = initGateway();
    if (!gw) return res.status(500).json({ status: false, message: 'Braintree not configured on server' });

    const { paymentMethodNonce, amount, products } = req.body;
    if (!paymentMethodNonce) return res.status(400).json({ status: false, message: 'Payment nonce required' });
    const saleRequest = {
      amount: String(amount),
      paymentMethodNonce,
      options: { submitForSettlement: true },
    };

    const result = await gw.transaction.sale(saleRequest);
    if (!result || !result.success) {
      return res.status(500).json({ status: false, message: 'Transaction failed', error: result });
    }

    // create order record
    const orderProducts = [];
    if (Array.isArray(products)) {
      for (const p of products) {
        // try to fetch product data for name/price snapshot
        const prod = await productModel.findById(p._id).select('name price');
        orderProducts.push({
          product: p._id,
          name: prod?.name || p.name || '',
          price: prod?.price || p.price || 0,
          qty: p.qty || 1,
        });
      }
    }

    const order = await new Order({
      products: orderProducts,
      payment: {
        transactionId: result.transaction.id,
        amount: result.transaction.amount,
        status: result.transaction.status,
        raw: result,
      },
      buyer: req.user ? req.user._id : undefined,
    }).save();

    return res.status(200).json({ status: true, transaction: result.transaction, order });
  } catch (error) {
    console.error('Payment error', error);
    return res.status(500).json({ status: false, message: 'Payment processing failed', error: error.message });
  }
};
