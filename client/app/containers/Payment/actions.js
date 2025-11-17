/*
 *
 * Payment actions
 *
 */

import { push } from 'connected-react-router';
import { success, error as errorNotification } from 'react-notification-system-redux';
import axios from 'axios';

import {
  PAYMENT_CHANGE,
  PAYMENT_SUCCESS,
  PAYMENT_ERROR,
  RESET_PAYMENT,
  SET_PAYMENT_LOADING,
  SET_GATEWAY_LOADING
} from './constants';

import { API_URL } from '../../constants';
import handleError from '../../utils/error';

export const paymentChange = (name, value) => {
  return {
    type: PAYMENT_CHANGE,
    payload: { name, value }
  };
};

export const setGatewayLoading = (isLoading) => {
  return {
    type: SET_GATEWAY_LOADING,
    payload: isLoading
  };
};

export const createPaymentSession = (paymentData) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SET_PAYMENT_LOADING, payload: true });
      
      const response = await axios.post(`${API_URL}/payment/create-session`, paymentData);
      
      if (response.data.success) {
        dispatch({
          type: PAYMENT_SUCCESS,
          payload: {
            paymentSessionId: response.data.payment_session_id,
            orderId: response.data.order_id
          }
        });
        return response.data;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Payment failed';
      
      dispatch({
        type: PAYMENT_ERROR,
        payload: errorMsg
      });
      
      const errorOptions = {
        title: 'Payment Error',
        message: errorMsg,
        position: 'tr',
        autoDismiss: 3
      };
      
      dispatch(errorNotification(errorOptions));
      throw error;
    }
  };
};

export const checkPaymentStatus = (orderId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/payment/status/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to check payment status:', error);
      throw error;
    }
  };
};

export const resetPayment = () => {
  return {
    type: RESET_PAYMENT
  };
};