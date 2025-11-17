/*
 *
 * OrderProcessingLoading
 *
 */

import React from 'react';

const OrderProcessingLoading = () => {
  return (
    <div className="order-processing-overlay">
      <div className="order-processing-container">
        <div className="order-processing-spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
        <h3 className="order-processing-title">Creating Your Order</h3>
        <p className="order-processing-text">
          Please wait while we process your order...
        </p>
        <div className="order-processing-steps">
          <div className="step active">
            <div className="step-icon">✓</div>
            <div className="step-text">Validating Cart</div>
          </div>
          <div className="step active">
            <div className="step-icon">⟳</div>
            <div className="step-text">Creating Order</div>
          </div>
          <div className="step">
            <div className="step-icon">→</div>
            <div className="step-text">Redirecting to Payment</div>
          </div>
        </div>
        <p className="order-processing-subtext">
          Do not close this page
        </p>
      </div>
    </div>
  );
};

export default OrderProcessingLoading;