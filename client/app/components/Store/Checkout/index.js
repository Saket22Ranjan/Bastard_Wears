/**
 *
 * Checkout
 *
 */

import React from 'react';

import Button from '../../Common/Button';

const Checkout = props => {
  const { 
    authenticated, 
    handleShopping, 
    handleCheckout, 
    placeOrderWithPayment, 
    isOrderProcessing,
    addresses
  } = props;

  return (
    <div className='easy-checkout'>
      {/* Show address info if user is authenticated */}
      {authenticated && addresses && addresses.length > 0 && (
        <div className='address-info mb-3'>
          <div className='alert alert-info p-2'>
            <small>
              <strong>✓ {addresses.length} Address{addresses.length > 1 ? 'es' : ''} Available</strong>
              <br />
              <small className='text-muted'>
                {addresses.find(a => a.isDefault) 
                  ? 'Default address will be used' 
                  : 'First address will be used'}
              </small>
            </small>
          </div>
        </div>
      )}

      <div className='checkout-actions'>
        <Button
          variant='primary'
          text='Continue shopping'
          onClick={() => handleShopping()}
          disabled={isOrderProcessing}
        />
        {authenticated ? (
          <Button
            variant='primary'
            text={isOrderProcessing ? 'Processing...' : 'Place Order & Pay'}
            disabled={isOrderProcessing}
            onClick={() => placeOrderWithPayment()}
          />
        ) : (
          <Button
            variant='primary'
            text='Proceed To Checkout'
            onClick={() => handleCheckout()}
          />
        )}
      </div>

      {/* Helper text for authenticated users */}
      {authenticated && (
        <div className='checkout-helper mt-3'>
          <small className='text-muted'>
            {addresses && addresses.length === 0 ? (
              <span className='text-warning'>
                ⚠️ You'll be redirected to add an address
              </span>
            ) : (
              <span>
                💡 Make sure your phone number is updated in Account Details
              </span>
            )}
          </small>
        </div>
      )}
    </div>
  );
};

export default Checkout;