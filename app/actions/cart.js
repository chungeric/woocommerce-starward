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

export const fetchCart = () => async (dispatch) => {
  dispatch({type: GET_CART});
  console.log('Firing fetchCart action');
  try {
    const payload = await axios.get(`${ROOT_API}/getcart`, { withCredentials: true });
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

export const addToCart = () => async (dispatch) => {
  dispatch({type: ADD_TO_CART});
  console.log('Firing addToCart action');
  try {
    const payload = await axios.get(`${ROOT_API}/addtocart`, {
      withCredentials: true,
      headers: {
        Cookie: 'woocommerce_cart_hash=49c977c4c9c4fabc0330757a5062f7ff; woocommerce_items_in_cart=1; wp_woocommerce_session_be9883144b2596a8fb509aa96ae7c3d0=44ea087e384ef0c4cc8d92adca84b982%7C%7C1531881628%7C%7C1531878028%7C%7Cdb7e21edb8128b2990c7d367a2146101;'
      }
    });
    dispatch(addToSuccess(payload));
  } catch (error) {
    dispatch(addToCartFailure(error));
  }
};
