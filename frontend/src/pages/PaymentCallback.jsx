import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/client';
import Loading from '../components/Loading';
import './PaymentCallback.scss';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    
    if (!orderId) {
      setStatus('error');
      setMessage('Invalid payment session');
      return;
    }

    verifyPayment(orderId);
  }, [searchParams]);

  const verifyPayment = async (orderId) => {
    try {
      const { data } = await API.post('/payments/verify', { orderId });

      if (data.verified) {
        setStatus('success');
        setMessage('Payment successful! Redirecting...');
        toast.success('Payment completed successfully!');
        
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        setStatus('failed');
        setMessage('Payment verification failed. Please contact support.');
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment Verification Error:', error);
      setStatus('error');
      setMessage('An error occurred while verifying payment');
      toast.error('Payment verification failed');
    }
  };

  return (
    <div className="payment-callback">
      <div className="container">
        <div className="callback-card">
          {status === 'processing' && (
            <>
              <Loading />
              <h2>{message}</h2>
              <p>Please wait while we confirm your payment...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="success-icon">✓</div>
              <h2>{message}</h2>
              <p>Your order has been placed successfully!</p>
            </>
          )}

          {(status === 'failed' || status === 'error') && (
            <>
              <div className="error-icon">✕</div>
              <h2>{message}</h2>
              <p>If money was deducted, it will be refunded within 5-7 business days.</p>
              <button onClick={() => navigate('/cart')} className="retry-btn">
                Go to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;