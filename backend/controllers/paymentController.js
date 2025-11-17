const axios = require('axios');
const crypto = require('crypto');
const Order = require('../models/Order');

// Cashfree API Configuration
const CASHFREE_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.cashfree.com/pg' 
  : 'https://sandbox.cashfree.com/pg';

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// @desc    Create payment order with Cashfree
// @route   POST /api/payments/create-order
// @access  Private
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId, amount, customerInfo } = req.body;

    if (!orderId || !amount || !customerInfo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment information',
      });
    }

    // Generate unique order ID for Cashfree
    const cashfreeOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare Cashfree request
    const cashfreeRequest = {
      order_id: cashfreeOrderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: req.user._id.toString(),
        customer_name: customerInfo.name,
        customer_email: req.user.email,
        customer_phone: customerInfo.phone,
      },
      order_meta: {
        return_url: `${process.env.CLIENT_URL}/payment/callback?order_id=${cashfreeOrderId}`,
        notify_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      },
      order_note: `Payment for Order ${orderId}`,
    };

    // Make request to Cashfree
    const response = await axios.post(
      `${CASHFREE_API_URL}/orders`,
      cashfreeRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
          'x-api-version': '2023-08-01',
        },
      }
    );

    res.status(200).json({
      success: true,
      paymentSessionId: response.data.payment_session_id,
      orderId: cashfreeOrderId,
      orderToken: response.data.order_token,
    });
  } catch (error) {
    console.error('Cashfree Payment Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.response?.data || error.message,
    });
  }
};

// @desc    Verify payment signature
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required',
      });
    }

    // Get payment status from Cashfree
    const response = await axios.get(
      `${CASHFREE_API_URL}/orders/${orderId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
          'x-api-version': '2023-08-01',
        },
      }
    );

    const paymentStatus = response.data.order_status;

    if (paymentStatus === 'PAID') {
      res.status(200).json({
        success: true,
        verified: true,
        payment: response.data,
      });
    } else {
      res.status(200).json({
        success: false,
        verified: false,
        status: paymentStatus,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.response?.data || error.message,
    });
  }
};

// @desc    Handle Cashfree webhook
// @route   POST /api/payments/webhook
// @access  Public (but verified)
exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', CASHFREE_SECRET_KEY)
      .update(timestamp + rawBody)
      .digest('base64');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const { type, data } = req.body;

    // Handle payment success
    if (type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { order_id, order_amount, payment_time } = data.order;
      
      console.log(`Payment successful for order: ${order_id}`);
      
      // You can update order status or perform other actions here
      // This is handled in the order creation flow
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:orderId
// @access  Private
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const response = await axios.get(
      `${CASHFREE_API_URL}/orders/${orderId}/payments`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
          'x-api-version': '2023-08-01',
        },
      }
    );

    res.status(200).json({
      success: true,
      payments: response.data,
    });
  } catch (error) {
    console.error('Get Payment Details Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment details',
      error: error.response?.data || error.message,
    });
  }
};