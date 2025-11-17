const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderConfirmation, sendAdminOrderNotification } = require('../config/email');

// @desc    Create new order (with payment)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { products, customerInfo, totalPrice, paymentInfo } = req.body;

    // Validation
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No products in order',
      });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete customer information',
      });
    }

    // Verify payment was successful
    if (!paymentInfo || paymentInfo.paymentStatus !== 'Success') {
      return res.status(400).json({
        success: false,
        message: 'Payment verification required',
      });
    }

    // Verify stock availability and update stock
    for (let item of products) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} not found`,
        });
      }

      const sizeStock = product.sizes.find(s => s.size === item.size);
      
      if (!sizeStock || sizeStock.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} in size ${item.size}`,
        });
      }

      // Reduce stock
      sizeStock.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      customerId: req.user._id,
      products,
      customerInfo,
      totalPrice,
      paymentInfo,
    });

    // Populate product details
    await order.populate('products.productId');

    // Send confirmation emails
    try {
      await sendOrderConfirmation(order, req.user.email);
      await sendAdminOrderNotification(order);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order if email fails
    }

    // Emit order update via socket
    if (global.emitOrderUpdate) {
      global.emitOrderUpdate(order);
    }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('products.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.productId')
      .populate('customerId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Make sure user is order owner or admin
    if (order.customerId._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order
    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    // Cannot cancel if already shipped
    if (order.status === 'Shipped' || order.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that has been shipped or delivered',
      });
    }

    // Restore stock
    for (let item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        const sizeStock = product.sizes.find(s => s.size === item.size);
        if (sizeStock) {
          sizeStock.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .populate('products.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    await order.save();

    // Emit order update via socket
    if (global.emitOrderUpdate) {
      global.emitOrderUpdate(order);
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};