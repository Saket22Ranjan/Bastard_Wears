/*
 *
 * Payment
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';

import LoadingIndicator from '../../components/Common/LoadingIndicator';
import PaymentLoading from '../../components/Common/PaymentLoading';
import NotFound from '../../components/Common/NotFound';

class Payment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isScriptLoaded: false,
      validationError: null
    };
  }

  componentDidMount() {
    // Validate before loading script
    const validationError = this.validatePaymentRequirements();
    
    if (validationError) {
      this.setState({ validationError });
      return;
    }

    this.loadCashfreeScript();

    // Get order from location state or redirect to cart
    if (!this.getOrderData()) {
      this.props.history.push('/cart');
    }
  }

  componentWillUnmount() {
    this.props.resetPayment();
  }

  validatePaymentRequirements = () => {
    const { user } = this.props;

    // Check if phone number exists
    if (!user || !user.phoneNumber || user.phoneNumber.trim() === '') {
      // Redirect to account details
      setTimeout(() => {
        this.props.history.push('/dashboard/account');
      }, 2000);
      
      return 'Phone number is required for payment. Redirecting to Account Details...';
    }

    return null;
  };

  getOrderData = () => {
    const { location, order } = this.props;

    // Order from navigation state (preferred)
    if (location.state && location.state.order) {
      return location.state.order;
    }

    // Order from redux state
    if (order && order._id) {
      return order;
    }

    return null;
  };

  loadCashfreeScript = () => {
    if (document.querySelector('script[src*="cashfree.js"]')) {
      this.setState({ isScriptLoaded: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => {
      this.setState({ isScriptLoaded: true });
    };
    script.onerror = () => {
      console.error('Failed to load Cashfree SDK');
      this.setState({ 
        validationError: 'Failed to load payment gateway. Please try again.' 
      });
    };
    document.head.appendChild(script);
  };

  handlePayment = async () => {
    const { createPaymentSession, setGatewayLoading, user } = this.props;
    const { isScriptLoaded } = this.state;

    // Re-validate phone number before payment
    if (!user.phoneNumber || user.phoneNumber.trim() === '') {
      this.props.history.push('/dashboard/account');
      return;
    }

    if (!isScriptLoaded) {
      console.error('Cashfree SDK not loaded');
      return;
    }

    const orderData = this.getOrderData();
    if (!orderData) {
      this.props.history.push('/cart');
      return;
    }

    try {
      setGatewayLoading(true);

      const paymentData = {
        orderAmount: orderData.total,
        orderId: orderData._id,
        description: `Order payment`
      };

      console.log('Creating payment session...', paymentData);
      const sessionResponse = await createPaymentSession(paymentData);
      console.log('Payment session created:', sessionResponse);

      if (sessionResponse && sessionResponse.payment_session_id) {
        const cashfree = window.Cashfree({
          mode: "production"
        });

        const checkoutOptions = {
          paymentSessionId: sessionResponse.payment_session_id,
          redirectTarget: "_modal"
        };

        console.log('Opening payment modal...');

        cashfree.checkout(checkoutOptions).then((result) => {
          console.log('Payment completed:', result);
          setGatewayLoading(false);
          this.props.history.push(`/order-success/${orderData._id}`);
        }).catch((error) => {
          console.error('Payment error:', error);
          setGatewayLoading(false);
          this.props.history.push(`/order-success/${orderData._id}`);
        });

        setTimeout(() => {
          setGatewayLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      setGatewayLoading(false);
    }
  };

  render() {
    const { payment, user } = this.props;
    const { isScriptLoaded, validationError } = this.state;
    const orderData = this.getOrderData();

    // Show validation error
    if (validationError) {
      return (
        <div className='payment-page'>
          <div className='container'>
            <div className='payment-container'>
              <div className='alert alert-warning mt-5'>
                <h4>⚠️ Payment Requirements</h4>
                <p>{validationError}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!orderData) {
      return <NotFound message='No order found. Please start from cart.' />;
    }

    if (payment.isLoading || !isScriptLoaded) {
      return <LoadingIndicator />;
    }

    return (
      <div className='payment-page'>
        {/* Payment Gateway Loading Screen */}
        {payment.isGatewayLoading && <PaymentLoading />}

        <div className='container'>
          <div className='payment-container'>
            <div className='payment-form'>
              <h2>Complete Your Payment</h2>

              <div className='order-summary'>
                <h3>Order Summary</h3>
                <div className='order-details'>
                  <div className='order-row'>
                    <span>Order ID:</span>
                    <span>#{orderData._id}</span>
                  </div>
                  <div className='order-row total-row'>
                    <span>Total Amount:</span>
                    <span><strong>₹{orderData.total}</strong></span>
                  </div>
                  {user && user.phoneNumber && (
                    <div className='order-row'>
                      <span>Contact:</span>
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {payment.error && (
                <div className='error-message'>
                  {payment.error}
                </div>
              )}

              <button
                className='btn-primary payment-btn'
                onClick={this.handlePayment}
                disabled={payment.isLoading || payment.isGatewayLoading || !isScriptLoaded}
              >
                {payment.isGatewayLoading ? 'Opening Gateway...' : payment.isLoading ? 'Processing...' : '🔒 Pay Securely'}
              </button>

              <div className='payment-security'>
                <p>🔒 Your payment is secured by Cashfree</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  payment: state.payment,
  order: state.order.order,
  user: state.account.user
});

export default connect(mapStateToProps, actions)(Payment);