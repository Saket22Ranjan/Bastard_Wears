/*
 *
 * Payment reducer
 *
 */

import {
  PAYMENT_CHANGE,
  PAYMENT_SUCCESS,
  PAYMENT_ERROR,
  RESET_PAYMENT,
  SET_PAYMENT_LOADING,
  SET_GATEWAY_LOADING
} from './constants';

const initialState = {
  paymentSessionId: null,
  orderId: null,
  isLoading: false,
  isGatewayLoading: false,
  error: null
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAYMENT_CHANGE:
      return {
        ...state,
        [action.payload.name]: action.payload.value
      };
    case PAYMENT_SUCCESS:
      return {
        ...state,
        paymentSessionId: action.payload.paymentSessionId,
        orderId: action.payload.orderId,
        isLoading: false,
        error: null
      };
    case PAYMENT_ERROR:
      return {
        ...state,
        isLoading: false,
        isGatewayLoading: false,
        error: action.payload
      };
    case SET_PAYMENT_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case SET_GATEWAY_LOADING:
      return {
        ...state,
        isGatewayLoading: action.payload
      };
    case RESET_PAYMENT:
      return initialState;
    default:
      return state;
  }
};

export default paymentReducer;