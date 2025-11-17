const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
  getPaymentDetails,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Create payment order
router.post('/create-order', protect, createPaymentOrder);

// Verify payment
router.post('/verify', protect, verifyPayment);

// Webhook endpoint (public but verified internally)
router.post('/webhook', handleWebhook);

// Get payment details
router.get('/:orderId', protect, getPaymentDetails);

module.exports = router;