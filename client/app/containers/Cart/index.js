/*
 *
 * Cart
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';

import CartList from '../../components/Store/CartList';
import CartSummary from '../../components/Store/CartSummary';
import Checkout from '../../components/Store/Checkout';
import OrderProcessingLoading from '../../components/Common/OrderProcessingLoading';
import { BagIcon, CloseIcon } from '../../components/Common/Icon';
import Button from '../../components/Common/Button';

class Cart extends React.PureComponent {
  componentDidMount() {
    // Fetch addresses when cart mounts if user is authenticated
    const { authenticated, fetchAddresses } = this.props;
    if (authenticated) {
      fetchAddresses();
    }
  }

  componentDidUpdate(prevProps) {
    // Fetch addresses when user logs in
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.fetchAddresses();
    }
  }

  render() {
    const {
      isCartOpen,
      cartItems,
      cartTotal,
      toggleCart,
      handleShopping,
      handleCheckout,
      handleRemoveFromCart,
      placeOrderWithPayment,
      authenticated,
      isOrderProcessing,
      addresses
    } = this.props;

    return (
      <div className='cart'>
        {/* Order Processing Loading Screen */}
        {isOrderProcessing && <OrderProcessingLoading />}
        
        <div className='cart-header'>
          {isCartOpen && (
            <Button
              borderless
              variant='empty'
              ariaLabel='close the cart'
              icon={<CloseIcon />}
              onClick={toggleCart}
            />
          )}
        </div>
        {cartItems.length > 0 ? (
          <div className='cart-body'>
            <CartList
              toggleCart={toggleCart}
              cartItems={cartItems}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          </div>
        ) : (
          <div className='empty-cart'>
            <BagIcon />
            <p>Your shopping cart is empty</p>
          </div>
        )}
        {cartItems.length > 0 && (
          <div className='cart-checkout'>
            <CartSummary cartTotal={cartTotal} />
            <Checkout
              handleShopping={handleShopping}
              handleCheckout={handleCheckout}
              placeOrderWithPayment={placeOrderWithPayment}
              authenticated={authenticated}
              isOrderProcessing={isOrderProcessing}
              addresses={addresses}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isCartOpen: state.navigation.isCartOpen,
    cartItems: state.cart.cartItems,
    cartTotal: state.cart.cartTotal,
    authenticated: state.authentication.authenticated,
    isOrderProcessing: state.cart.isOrderProcessing,
    addresses: state.address.addresses
  };
};

export default connect(mapStateToProps, actions)(Cart);