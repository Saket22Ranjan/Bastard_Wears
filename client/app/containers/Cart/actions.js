/*
 *
 * Cart actions
 *
 */

import { push } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  HANDLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CLEAR_CART,
  SET_ORDER_PROCESSING
} from './constants';

import {
  SET_PRODUCT_SHOP_FORM_ERRORS,
  RESET_PRODUCT_SHOP
} from '../Product/constants';

import { API_URL, CART_ID, CART_ITEMS, CART_TOTAL } from '../../constants';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { toggleCart } from '../Navigation/actions';

// Set order processing state
export const setOrderProcessing = (isProcessing) => {
  return {
    type: SET_ORDER_PROCESSING,
    payload: isProcessing
  };
};

// Handle Add To Cart
export const handleAddToCart = product => {
  return (dispatch, getState) => {
    const productShopData = getState().product.productShopData;
    
    // Validation for size selection
    if (!productShopData.size || !productShopData.size.value) {
      return dispatch({ 
        type: SET_PRODUCT_SHOP_FORM_ERRORS, 
        payload: { size: 'Please select a size.' }
      });
    }

    product.quantity = Number(productShopData.quantity);
    product.selectedSize = productShopData.size;
    product.totalPrice = product.quantity * product.price;
    product.totalPrice = parseFloat(product.totalPrice.toFixed(2));
    const inventory = getState().product.storeProduct.inventory;

    const result = calculatePurchaseQuantity(inventory);

    const rules = {
      quantity: `min:1|max:${result}`
    };

    const { isValid, errors } = allFieldsValidation(product, rules, {
      'min.quantity': 'Quantity must be at least 1.',
      'max.quantity': `Quantity may not be greater than ${result}.`
    });

    if (!isValid) {
      return dispatch({ type: SET_PRODUCT_SHOP_FORM_ERRORS, payload: errors });
    }

    dispatch({
      type: RESET_PRODUCT_SHOP
    });

    dispatch({
      type: ADD_TO_CART,
      payload: product
    });

    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS));
    let newCartItems = [];
    if (cartItems) {
      newCartItems = [...cartItems, product];
    } else {
      newCartItems.push(product);
    }
    localStorage.setItem(CART_ITEMS, JSON.stringify(newCartItems));

    dispatch(calculateCartTotal());
    dispatch(toggleCart());
  };
};

// Handle Remove From Cart
export const handleRemoveFromCart = product => {
  return (dispatch, getState) => {
    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS));
    const newCartItems = cartItems.filter(item => item._id !== product._id);
    localStorage.setItem(CART_ITEMS, JSON.stringify(newCartItems));

    dispatch({
      type: REMOVE_FROM_CART,
      payload: product
    });
    dispatch(calculateCartTotal());
  };
};

export const calculateCartTotal = () => {
  return (dispatch, getState) => {
    const cartItems = getState().cart.cartItems;

    let total = 0;

    cartItems.map(item => {
      total += item.price * item.quantity;
    });

    total = parseFloat(total.toFixed(2));
    localStorage.setItem(CART_TOTAL, total);
    dispatch({
      type: HANDLE_CART_TOTAL,
      payload: total
    });
  };
};

// set cart store from local storage
export const handleCart = () => {
  const cart = {
    cartItems: JSON.parse(localStorage.getItem(CART_ITEMS)),
    cartTotal: localStorage.getItem(CART_TOTAL),
    cartId: localStorage.getItem(CART_ID)
  };

  return (dispatch, getState) => {
    if (cart.cartItems != undefined) {
      dispatch({
        type: HANDLE_CART,
        payload: cart
      });
      dispatch(calculateCartTotal());
    }
  };
};

export const handleCheckout = () => {
  return (dispatch, getState) => {
    const successfulOptions = {
      title: `Please Login to proceed to checkout`,
      position: 'tr',
      autoDismiss: 1
    };

    dispatch(toggleCart());
    dispatch(push('/login'));
    dispatch(success(successfulOptions));
  };
};

// Continue shopping use case
export const handleShopping = () => {
  return (dispatch, getState) => {
    dispatch(push('/shop'));
    dispatch(toggleCart());
  };
};

// create cart id api
export const getCartId = () => {
  return async (dispatch, getState) => {
    try {
      const cartId = localStorage.getItem(CART_ID);
      const cartItems = getState().cart.cartItems;
      const products = getCartItems(cartItems);

      // create cart id if there is no one
      if (!cartId) {
        const response = await axios.post(`${API_URL}/cart/add`, { products });

        dispatch(setCartId(response.data.cartId));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const setCartId = cartId => {
  return (dispatch, getState) => {
    localStorage.setItem(CART_ID, cartId);
    dispatch({
      type: SET_CART_ID,
      payload: cartId
    });
  };
};

export const clearCart = () => {
  return (dispatch, getState) => {
    localStorage.removeItem(CART_ITEMS);
    localStorage.removeItem(CART_TOTAL);
    localStorage.removeItem(CART_ID);

    dispatch({
      type: CLEAR_CART
    });
  };
};

const getCartItems = cartItems => {
  const newCartItems = [];
  cartItems.map(item => {
    const newItem = {};
    newItem.quantity = item.quantity;
    newItem.price = item.price;
    newItem.taxable = item.taxable;
    newItem.product = item._id;
    newItem.size = item.selectedSize ? item.selectedSize.value : null;
    newCartItems.push(newItem);
  });

  return newCartItems;
};

const calculatePurchaseQuantity = inventory => {
  if (inventory <= 25) {
    return 1;
  } else if (inventory > 25 && inventory <= 100) {
    return 5;
  } else if (inventory > 100 && inventory < 500) {
    return 25;
  } else {
    return 50;
  }
};

// UPDATED: Better validation with redirects
export const placeOrderWithPayment = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderProcessing(true));
      
      const state = getState();
      const { cart, address, account } = state;
      const user = account.user;
      
      // 1. VALIDATE PHONE NUMBER FIRST
      if (!user.phoneNumber || user.phoneNumber.trim() === '') {
        dispatch(setOrderProcessing(false));
        dispatch(toggleCart());
        
        const errorOptions = {
          title: '📞 Phone Number Required',
          message: 'Please add your phone number in Account Details before placing an order.',
          position: 'tr',
          autoDismiss: 5
        };
        dispatch(success(errorOptions));
        
        // Redirect to account details
        dispatch(push('/dashboard'));
        return;
      }
      
      // 2. VALIDATE ADDRESS
      const addresses = address.addresses || [];
      
      if (addresses.length === 0) {
        dispatch(setOrderProcessing(false));
        dispatch(toggleCart());
        
        const errorOptions = {
          title: '📍 Address Required',
          message: 'Please add a delivery address before placing an order.',
          position: 'tr',
          autoDismiss: 5
        };
        dispatch(success(errorOptions));
        
        // Redirect to add address page
        dispatch(push('/dashboard/address/add'));
        return;
      }
      
      // Use the first address (or default if available)
      const defaultAddress = addresses.find(addr => addr.isDefault);
      const selectedAddress = defaultAddress || addresses[0];
      
      // 3. CREATE CART ID IF NEEDED
      if (!cart.cartId) {
        await dispatch(getCartId());
      }
      
      const updatedCartId = getState().cart.cartId;
      
      // 4. CREATE ORDER
      const orderData = {
        cartId: updatedCartId,
        total: cart.cartTotal,
        addressId: selectedAddress._id
      };
      
      const response = await axios.post(`${API_URL}/order/add`, orderData);
      
      if (response.data.success) {
        const order = response.data.order;
        
        dispatch(clearCart());
        dispatch(toggleCart());
        
        // Navigate to payment page
        dispatch(push({
          pathname: '/payment',
          state: { order }
        }));
        
        dispatch(setOrderProcessing(false));
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      
      dispatch(setOrderProcessing(false));
      
      const errorMsg = error.response?.data?.error || 'Order creation failed. Please try again.';
      const errorOptions = {
        title: '❌ Order Failed',
        message: errorMsg,
        position: 'tr',
        autoDismiss: 5
      };
      dispatch(success(errorOptions));
    }
  };
};