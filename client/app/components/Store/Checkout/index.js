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
    placeOrder, 
    placeOrderWithPayment, 
    selectedAddress,
    addresses,
    onAddressSelect,
    isOrderProcessing
  } = props;

  return (
    <div className='easy-checkout'>
      {authenticated && addresses && addresses.length > 0 && (
        <div className='address-selection mb-4'>
          <h5>Select Delivery Address</h5>
          <div className='address-list'>
            {addresses.map((address, index) => (
              <div 
                key={address._id} 
                className={`address-item p-3 mb-2 border rounded ${
                  selectedAddress && selectedAddress._id === address._id 
                    ? 'border-primary bg-light' 
                    : 'border-secondary'
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => onAddressSelect && onAddressSelect(address)}
              >
                <div className='d-flex justify-content-between align-items-start'>
                  <div>
                    <p className='mb-1'><strong>{address.name}</strong></p>
                    <p className='mb-1 text-muted'>{address.phoneNumber}</p>
                    <p className='mb-1'>{address.address}</p>
                    <p className='mb-0 text-muted'>
                      {address.city}, {address.state}, {address.country} - {address.zipCode}
                    </p>
                    {address.isDefault && (
                      <small className='text-success font-weight-bold'>Default Address</small>
                    )}
                  </div>
                  <div>
                    <input 
                      type='radio'
                      name='selectedAddress'
                      checked={selectedAddress && selectedAddress._id === address._id}
                      onChange={() => onAddressSelect && onAddressSelect(address)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                  </div>
                </div>
              </div>
            ))}
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

      {authenticated && !selectedAddress && addresses && addresses.length > 0 && (
        <div className='alert alert-warning mt-3'>
          <small>Please select a delivery address to proceed with the order.</small>
        </div>
      )}
    </div>
  );
};

export default Checkout;