const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const cashfree = require('../../config/cashfree');
const Order = require('../../models/order');

// @route   POST api/payment/create-session
// @desc    Create payment session
// @access  Private
router.post('/create-session', auth, async (req, res) => {
    try {
        console.log('=== PAYMENT SESSION DEBUG ===');
        console.log('Request body:', req.body);
        console.log('User:', req.user ? 'Authenticated' : 'Not authenticated');
        console.log('Environment vars:', {
            appId: process.env.CASHFREE_APP_ID ? 'Set' : 'Missing',
            secretKey: process.env.CASHFREE_SECRET_KEY ? 'Set' : 'Missing',
            environment: process.env.CASHFREE_ENVIRONMENT
        });

        const user = req.user;
        const { orderAmount, orderId, description } = req.body;

        console.log('Parsed data:', { orderAmount, orderId, description });

        if (!orderAmount || !orderId) {
            console.log('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Order amount and order ID are required'
            });
        }
        // const address = await Address.findById(addressId);
        const orderData = {
            order_amount: parseFloat(orderAmount),
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: user._id.toString(),
                customer_name: `${user.firstName} ${user.lastName}`,
                customer_email: user.email,
                customer_phone: user.phoneNumber
            },
            order_meta: {
                // Use dummy HTTPS URLs for development
                return_url: `https://example.com/order-success/${orderId}`,
                notify_url: `https://example.com/api/payment/webhook`
            },
            order_note: description || `Order payment`
        };

        console.log('Order data to send to Cashfree:', orderData);
        console.log('About to call cashfree.createOrder...');

        const response = await cashfree.createOrder(orderData);

        console.log('Cashfree response:', response);

        res.json({
            success: true,
            payment_session_id: response.payment_session_id,
            order_id: response.order_id,
            order_amount: response.order_amount
        });

    } catch (error) {
        console.error('=== PAYMENT ERROR DETAILS ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Cashfree API error:', error.response?.data);
        console.error('Status code:', error.response?.status);
        console.error('Headers:', error.response?.headers);

        res.status(500).json({
            success: false,
            message: 'Failed to create payment session',
            error: error.message
        });
    }
});

// @route   GET api/payment/status/:orderId
// @desc    Get payment status
// @access  Private
router.get('/status/:orderId', auth, async (req, res) => {
    try {
        const { orderId } = req.params;

        const response = await cashfree.getPaymentStatus(orderId);

        res.json({
            success: true,
            payments: response
        });

    } catch (error) {
        console.error('Failed to fetch payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment status',
            error: error.message
        });
    }
});

// @route   POST api/payment/webhook
// @desc    Handle Cashfree webhooks
// @access  Public
router.post('/webhook', async (req, res) => {
    try {
        const {
            order_id,
            payment_status,
            payment_time,
            cf_payment_id
        } = req.body;

        console.log('Payment webhook received:', req.body);

        // Optional: Verify webhook signature for security
        // const timestamp = req.headers['x-webhook-timestamp'];
        // const signature = req.headers['x-webhook-signature'];
        // const isValidSignature = cashfree.verifyWebhookSignature(
        //     JSON.stringify(req.body), 
        //     timestamp, 
        //     signature
        // );
        // if (!isValidSignature) {
        //     return res.status(401).json({ message: 'Invalid signature' });
        // }

        let updateData = {};

        switch (payment_status) {
            case 'SUCCESS':
                updateData = {
                    paymentStatus: 'Completed',
                    paymentId: cf_payment_id,
                    paidAt: new Date(payment_time)
                };
                break;

            case 'FAILED':
                updateData = {
                    paymentStatus: 'Failed'
                };
                break;

            case 'USER_DROPPED':
                updateData = {
                    paymentStatus: 'Cancelled'
                };
                break;
        }

        await Order.findByIdAndUpdate(order_id, updateData);

        res.status(200).json({ message: 'Webhook processed successfully' });

    } catch (error) {
        console.error('Webhook processing failed:', error);
        res.status(500).json({ message: 'Webhook processing failed' });
    }
});

module.exports = router;