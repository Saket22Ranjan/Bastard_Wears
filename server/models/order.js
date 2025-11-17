const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Order Schema
const OrderSchema = new Schema({
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  total: {
    type: Number,
    default: 0
  },
  // NEW PAYMENT FIELDS
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'],
    default: 'Credit Card'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Cancelled'],
    default: 'Pending'
  },
  paymentId: {
    type: String
  },
  paidAt: {
    type: Date
  },
  // END NEW FIELDS
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Order', OrderSchema);