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
  dispatch({type: GET_CART_FAILURE, payload: error});
};

const fetchCartSuccess = payload => async (dispatch) => {
  dispatch({type: GET_CART_SUCCESS, payload});
};

export const fetchCart = () => async (dispatch) => {
  dispatch({type: GET_CART});
  try {
    const payload = await axios.post(`${ROOT_API}/buyabeanie`);
    dispatch(fetchCartSuccess(payload));
  } catch (error) {
    dispatch(fetchCartFailure(error));
  }
};

const addToCartFailure = error => async (dispatch) => {
  dispatch({type: ADD_TO_CART_FAILURE, payload: error});
};

const addToSuccess = payload => async (dispatch) => {
  dispatch({type: ADD_TO_CART_SUCCESS, payload});
};

export const addToCart = () => async (dispatch) => {
  dispatch({type: ADD_TO_CART});
  try {
    const payload = await axios.post(`${ROOT_API}/buyabeanie`);
    dispatch(addToSuccess(payload));
  } catch (error) {
    dispatch(addToCartFailure(error));
  }
};
