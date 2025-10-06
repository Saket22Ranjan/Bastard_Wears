/*
 *
 * Order actions
 *
 */

import { push } from 'connected-react-router';
import axios from 'axios';
import { success, warning } from 'react-notification-system-redux';

import {
  FETCH_ORDERS,
  FETCH_SEARCHED_ORDERS,
  FETCH_ORDER,
  UPDATE_ORDER_STATUS,
  SET_ORDERS_LOADING,
  SET_ADVANCED_FILTERS,
  CLEAR_ORDERS
} from './constants';

import { clearCart, getCartId } from '../Cart/actions';
import { toggleCart } from '../Navigation/actions';
import { fetchAddresses } from '../Address/actions';
import handleError from '../../utils/error';
import { API_URL } from '../../constants';

export const updateOrderStatus = value => {
  return {
    type: UPDATE_ORDER_STATUS,
    payload: value
  };
};

export const setOrderLoading = value => {
  return {
    type: SET_ORDERS_LOADING,
    payload: value
  };
};

export const fetchOrders = (page = 1) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get(`${API_URL}/order`, {
        params: {
          page: page ?? 1,
          limit: 20
        }
      });

      const { orders, totalPages, currentPage, count } = response.data;

      dispatch({
        type: FETCH_ORDERS,
        payload: orders
      });

      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages, currentPage, count }
      });
    } catch (error) {
      dispatch(clearOrders());
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const fetchAccountOrders = (page = 1) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get(`${API_URL}/order/me`, {
        params: {
          page: page ?? 1,
          limit: 20
        }
      });

      const { orders, totalPages, currentPage, count } = response.data;

      dispatch({
        type: FETCH_ORDERS,
        payload: orders
      });

      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages, currentPage, count }
      });
    } catch (error) {
      dispatch(clearOrders());
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const searchOrders = filter => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get(`${API_URL}/order/search`, {
        params: {
          search: filter.value
        }
      });

      dispatch({
        type: FETCH_SEARCHED_ORDERS,
        payload: response.data.orders
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const fetchOrder = (id, withLoading = true) => {
  return async (dispatch, getState) => {
    try {
      if (withLoading) {
        dispatch(setOrderLoading(true));
      }

      const response = await axios.get(`${API_URL}/order/${id}`);

      dispatch({
        type: FETCH_ORDER,
        payload: response.data.order
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      if (withLoading) {
        dispatch(setOrderLoading(false));
      }
    }
  };
};

export const cancelOrder = () => {
  return async (dispatch, getState) => {
    try {
      const order = getState().order.order;

      await axios.delete(`${API_URL}/order/cancel/${order._id}`);

      const successfulOptions = {
        title: 'Order cancelled successfully',
        position: 'tr',
        autoDismiss: 2
      };

      dispatch(success(successfulOptions));
      dispatch(push(`/dashboard/orders`));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const updateOrderItemStatus = (itemId, status) => {
  return async (dispatch, getState) => {
    try {
      const order = getState().order.order;

      const response = await axios.put(
        `${API_URL}/order/status/item/${itemId}`,
        {
          orderId: order._id,
          cartId: order.cartId,
          status
        }
      );

      if (response.data.orderCancelled) {
        dispatch(push(`/dashboard/orders`));
      } else {
        dispatch(updateOrderStatus({ itemId, status }));
        dispatch(fetchOrder(order._id, false));
      }

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch(success(successfulOptions));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const validateUserAddress = () => {
  return async (dispatch, getState) => {
    try {
      const addresses = getState().address?.addresses || [];
      
      if (addresses.length === 0) {
        await dispatch(fetchAddresses());
        const updatedAddresses = getState().address?.addresses || [];
        
        if (updatedAddresses.length === 0) {
          const warningOptions = {
            title: 'Address Required',
            message: 'Please add a delivery address before placing your order.',
            position: 'tr',
            autoDismiss: 3
          };
          dispatch(warning(warningOptions));
          dispatch(push('/dashboard/address/add'));
          return false;
        }
      }
      
      const hasDefaultAddress = addresses.some(addr => addr.isDefault);
      
      if (!hasDefaultAddress && addresses.length > 0) {
        const warningOptions = {
          title: 'Default Address Required',
          message: 'Please select a default delivery address.',
          position: 'tr',
          autoDismiss: 3
        };
        dispatch(warning(warningOptions));
        dispatch(push('/dashboard/address'));
        return false;
      }
      
      return true;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };
};

export const addOrder = () => {
  return async (dispatch, getState) => {
    try {
      const cartId = localStorage.getItem('cart_id');
      const total = getState().cart.cartTotal;
      const addresses = getState().address?.addresses || [];
      
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];

      if (cartId && defaultAddress) {
        const response = await axios.post(`${API_URL}/order/add`, {
          cartId,
          total,
          addressId: defaultAddress._id,
          address: defaultAddress
        });

        dispatch(push(`/order/success/${response.data.order._id}`));
        dispatch(clearCart());
      } else if (cartId) {
        const response = await axios.post(`${API_URL}/order/add`, {
          cartId,
          total
        });

        dispatch(push(`/order/success/${response.data.order._id}`));
        dispatch(clearCart());
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const placeOrder = () => {
  return async (dispatch, getState) => {
    const token = localStorage.getItem('token');
    const cartItems = getState().cart.cartItems;

    if (token && cartItems.length > 0) {
      try {
        const hasValidAddress = await dispatch(validateUserAddress());
        
        if (hasValidAddress) {
          await Promise.all([dispatch(getCartId())]);
          dispatch(addOrder());
          dispatch(toggleCart());
        }
      } catch (error) {
        handleError(error, dispatch);
      }
    } else {
      dispatch(toggleCart());
    }
  };
};

export const clearOrders = () => {
  return {
    type: CLEAR_ORDERS
  };
};