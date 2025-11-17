/*
 *
 * PaymentLoading
 *
 */

import React from 'react';

const PaymentLoading = () => {
  return (
    <div className="payment-loading-overlay">
      <div className="payment-loading-container">
        <div className="payment-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <h3 className="payment-loading-title">Processing Payment</h3>
        <p className="payment-loading-text">
          Please wait while we redirect you to the payment gateway...
        </p>
        <p className="payment-loading-subtext">
          Do not refresh or close this page
        </p>
      </div>
    </div>
  );
};

export default PaymentLoading;