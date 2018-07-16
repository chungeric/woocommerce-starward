import axios from 'axios';
import { ROOT_API } from '../config/app';

import {
  GET_CART,
  GET_CART_SUCCESS,
  GET_CART_FAILURE,
  ADD_TO_CART,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE
} from './types';


const fetchCartFailure = error => async (dispatch) => {
  console.error('Error @ fetchCart', error);
  dispatch({type: GET_CART_FAILURE, payload: error});
};

const fetchCartSuccess = payload => async (dispatch) => {
  console.log('fetchCart success', payload);
  dispatch({type: GET_CART_SUCCESS, payload});
};

export const fetchCart = (sessionCookie) => async (dispatch) => {
  dispatch({type: GET_CART});
  console.log('Firing fetchCart action');
  const config = {};
  if (sessionCookie) config['session-data'] = sessionCookie;
  try {
    const payload = await axios.get(`${ROOT_API}/getcart`, { withCredentials: true }, {
      headers: config
    });
    dispatch(fetchCartSuccess(payload));
  } catch (error) {
    dispatch(fetchCartFailure(error));
  }
};

const addToCartFailure = error => async (dispatch) => {
  console.error('Error @ addToCart', error);
  dispatch({type: ADD_TO_CART_FAILURE, payload: error});
};

const addToSuccess = payload => async (dispatch) => {
  console.log('addToCart success', payload);
  dispatch({type: ADD_TO_CART_SUCCESS, payload});
};

export const addToCart = (sessionCookie) => async (dispatch) => {
  dispatch({type: ADD_TO_CART});
  console.log('Firing addToCart action');
  const config = {};
  if (sessionCookie) config['session-data'] = sessionCookie;
  try {
    const payload = await axios.get(`${ROOT_API}/addtocart`, {
      withCredentials: true,
      headers: {
        headers: config
      }
    });
    dispatch(addToSuccess(payload));
  } catch (error) {
    dispatch(addToCartFailure(error));
  }
};
