/*
 *
 * Address actions
 *
 */

import { goBack, push } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  FETCH_ADDRESS,
  FETCH_ADDRESSES,
  ADDRESS_CHANGE,
  ADDRESS_EDIT_CHANGE,
  SET_ADDRESS_FORM_ERRORS,
  SET_ADDRESS_FORM_EDIT_ERRORS,
  RESET_ADDRESS,
  ADD_ADDRESS,
  REMOVE_ADDRESS,
  SET_ADDRESS_LOADING,
  ADDRESS_SELECT
} from './constants';

import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

/* -----------------------------
 * FORM CHANGE HANDLERS
 * ----------------------------- */
export const addressChange = (name, value) => ({
  type: ADDRESS_CHANGE,
  payload: { [name]: value }
});

export const addressEditChange = (name, value) => ({
  type: ADDRESS_EDIT_CHANGE,
  payload: { [name]: value }
});

export const handleAddressSelect = value => ({
  type: ADDRESS_SELECT,
  payload: value
});

export const setAddressLoading = value => ({
  type: SET_ADDRESS_LOADING,
  payload: value
});

/* -----------------------------
 * FETCH ALL ADDRESSES
 * ----------------------------- */
export const fetchAddresses = () => {
  return async dispatch => {
    try {
      dispatch(setAddressLoading(true));
      const response = await axios.get(`${API_URL}/address`);
      dispatch({
        type: FETCH_ADDRESSES,
        payload: response.data.addresses || []
      });
    } catch (err) {
      handleError(err, dispatch);
    } finally {
      dispatch(setAddressLoading(false));
    }
  };
};

/* -----------------------------
 * FETCH SINGLE ADDRESS
 * ----------------------------- */
export const fetchAddress = addressId => {
  return async dispatch => {
    try {
      const response = await axios.get(`${API_URL}/address/${addressId}`);
      dispatch({
        type: FETCH_ADDRESS,
        payload: response.data.address
      });
    } catch (err) {
      handleError(err, dispatch);
    }
  };
};

/* -----------------------------
 * ADD ADDRESS
 * ----------------------------- */
export const addAddress = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        name: 'required',
        phoneNumber: 'required|min:10',
        address: 'required',
        city: 'required',
        state: 'required',
        country: 'required',
        zipCode: 'required|min:5'
      };

      const newAddress = getState().address.addressFormData;
      const isDefault = getState().address.isDefault;

      const { isValid, errors } = allFieldsValidation(newAddress, rules, {
        'required.name': 'Name is required.',
        'required.phoneNumber': 'Phone number is required.',
        'min.phoneNumber': 'Phone number must be at least 10 digits.',
        'required.address': 'Address is required.',
        'required.city': 'City is required.',
        'required.state': 'State is required.',
        'required.country': 'Country is required.',
        'required.zipCode': 'Zipcode is required.',
        'min.zipCode': 'Zipcode must be at least 5 characters.'
      });

      if (!isValid) {
        return dispatch({ type: SET_ADDRESS_FORM_ERRORS, payload: errors });
      }

      // Add the new address
      const response = await axios.post(`${API_URL}/address/add`, {
        ...newAddress,
        isDefault
      });

      if (response.data.success) {
        // If this address is set as default, unset others
        if (isDefault) {
          await axios.put(`${API_URL}/address/set-default/${response.data.address._id}`);
        }

        dispatch({
          type: ADD_ADDRESS,
          payload: response.data.address
        });

        const successOptions = {
          title: response.data.message || 'Address added successfully',
          position: 'tr',
          autoDismiss: 2
        };
        dispatch(success(successOptions));

        dispatch({ type: RESET_ADDRESS });
        dispatch(push('/dashboard/address'));
      }
    } catch (err) {
      handleError(err, dispatch);
    }
  };
};

/* -----------------------------
 * UPDATE ADDRESS
 * ----------------------------- */
export const updateAddress = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        name: 'required',
        phoneNumber: 'required|min:10',
        country: 'required',
        city: 'required',
        state: 'required',
        address: 'required',
        zipCode: 'required|min:5'
      };

      const updatedAddress = getState().address.address;

      const { isValid, errors } = allFieldsValidation(updatedAddress, rules, {
        'required.name': 'Name is required.',
        'required.phoneNumber': 'Phone number is required.',
        'min.phoneNumber': 'Phone number must be at least 10 digits.',
        'required.address': 'Address is required.',
        'required.city': 'City is required.',
        'required.state': 'State is required.',
        'required.country': 'Country is required.',
        'required.zipCode': 'Zipcode is required.',
        'min.zipCode': 'Zipcode must be at least 5 characters.'
      });

      if (!isValid) {
        return dispatch({
          type: SET_ADDRESS_FORM_EDIT_ERRORS,
          payload: errors
        });
      }

      const response = await axios.put(
        `${API_URL}/address/${updatedAddress._id}`,
        updatedAddress
      );

      if (response.data.success) {
        // Handle default address logic
        if (updatedAddress.isDefault) {
          await axios.put(`${API_URL}/address/set-default/${updatedAddress._id}`);
        }

        const successOptions = {
          title: response.data.message || 'Address updated successfully',
          position: 'tr',
          autoDismiss: 2
        };
        dispatch(success(successOptions));
        dispatch(push('/dashboard/address'));
      }
    } catch (err) {
      handleError(err, dispatch);
    }
  };
};

/* -----------------------------
 * DELETE ADDRESS
 * ----------------------------- */
export const deleteAddress = id => {
  return async dispatch => {
    try {
      const response = await axios.delete(`${API_URL}/address/delete/${id}`);

      if (response.data.success) {
        dispatch({
          type: REMOVE_ADDRESS,
          payload: id
        });

        const successOptions = {
          title: response.data.message || 'Address deleted successfully',
          position: 'tr',
          autoDismiss: 2
        };
        dispatch(success(successOptions));

        dispatch(goBack());
      }
    } catch (err) {
      handleError(err, dispatch);
    }
  };
};
