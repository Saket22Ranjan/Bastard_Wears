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
      isScriptLoaded: false
    };
  }

  componentDidMount() {
    this.loadCashfreeScript();

    // Get order from location state or redirect to cart
    if (!this.getOrderData()) {
      this.props.history.push('/cart');
    }
  }

  componentWillUnmount() {
    this.props.resetPayment();
  }

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
    };
    document.head.appendChild(script);
  };

  handlePayment = async () => {
    const { createPaymentSession, setGatewayLoading } = this.props;
    const { isScriptLoaded } = this.state;

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
      // Show gateway loading screen
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
          // Hide loading when modal opens
          setGatewayLoading(false);
          // Always redirect to success after payment
          this.props.history.push(`/order-success/${orderData._id}`);
        }).catch((error) => {
          console.error('Payment error:', error);
          // Hide loading on error
          setGatewayLoading(false);
          // Still redirect to success for testing
          this.props.history.push(`/order-success/${orderData._id}`);
        });

        // Hide loading after a short delay (when modal starts opening)
        setTimeout(() => {
          setGatewayLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      // Hide loading on error
      setGatewayLoading(false);
    }
  };


  render() {
    const { payment, user } = this.props;
    const { isScriptLoaded } = this.state;
    const orderData = this.getOrderData();

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