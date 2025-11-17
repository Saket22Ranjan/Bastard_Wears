const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Please provide customer name'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      match: [/^[0-9]{10}$/, 'Please provide valid 10-digit phone number'],
    },
    address: {
      street: {
        type: String,
        required: [true, 'Please provide street address'],
      },
      city: {
        type: String,
        required: [true, 'Please provide city'],
      },
      state: {
        type: String,
        required: [true, 'Please provide state'],
      },
      pincode: {
        type: String,
        required: [true, 'Please provide pincode'],
        match: [/^[0-9]{6}$/, 'Please provide valid 6-digit pincode'],
      },
    },
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    price: Number,
    image: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    size: {
      type: String,
      required: [true, 'Please select a size'],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentInfo: {
    cashfreeOrderId: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Success', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);