import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/client';
import { CartContext } from '../context/CartContext';
import './Checkout.scss';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    // Load Cashfree SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalAmount = getCartTotal();

      // Step 1: Create payment order with Cashfree
      const { data: paymentData } = await API.post('/payments/create-order', {
        orderId: `temp_${Date.now()}`,
        amount: totalAmount,
        customerInfo: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: {
            street: customerInfo.street,
            city: customerInfo.city,
            state: customerInfo.state,
            pincode: customerInfo.pincode,
          },
        },
      });

      const { paymentSessionId, orderId } = paymentData;

      // Step 2: Initialize Cashfree SDK
      const cashfree = window.Cashfree({
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      });

      // Step 3: Open payment modal
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        returnUrl: `${window.location.origin}/payment/callback?order_id=${orderId}`,
      };

      cashfree.checkout(checkoutOptions).then((result) => {
        if (result.error) {
          toast.error(result.error.message || 'Payment failed');
          setLoading(false);
          return;
        }

        if (result.paymentDetails) {
          // Payment successful, verify and create order
          handlePaymentSuccess(orderId, result.paymentDetails);
        }
      });
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (cashfreeOrderId, paymentDetails) => {
    try {
      // Verify payment with backend
      const { data: verifyData } = await API.post('/payments/verify', {
        orderId: cashfreeOrderId,
      });

      if (!verifyData.verified) {
        toast.error('Payment verification failed');
        setLoading(false);
        return;
      }

      // Create order in database
      const orderData = {
        products: cart,
        customerInfo: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: {
            street: customerInfo.street,
            city: customerInfo.city,
            state: customerInfo.state,
            pincode: customerInfo.pincode,
          },
        },
        totalPrice: getCartTotal(),
        paymentInfo: {
          cashfreeOrderId: cashfreeOrderId,
          paymentId: paymentDetails.payment_id || paymentDetails.cf_payment_id,
          paymentStatus: 'Success',
          paymentMethod: paymentDetails.payment_method,
          paidAt: new Date(),
        },
      };

      const { data: orderResponse } = await API.post('/orders', orderData);

      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders`);
    } catch (error) {
      console.error('Order Creation Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-layout">
          <form onSubmit={handlePayment} className="checkout-form">
            <h3>Shipping Information</h3>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
              />
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={customerInfo.street}
                onChange={handleChange}
                required
                placeholder="House no, Street name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={customerInfo.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={customerInfo.state}
                  onChange={handleChange}
                  required
                  placeholder="State"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={customerInfo.pincode}
                onChange={handleChange}
                required
                pattern="[0-9]{6}"
                placeholder="6-digit pincode"
              />
            </div>

            <div className="payment-info">
              <p>💳 Secure payment powered by Cashfree</p>
              <p>✓ UPI, Cards, Net Banking & Wallets accepted</p>
            </div>

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${getCartTotal().toLocaleString('en-IN')}`}
            </button>
          </form>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="summary-item">
                  <div>
                    <p className="item-name">{item.name}</p>
                    <p className="item-details">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <p className="item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;