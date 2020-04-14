import {
  USER_PRODUCT_SOLD_LOADED,
  USER_PRODUCT_SOLD_ERROR,
  USER_PRODUCT_BOUGHT_LOADED,
  USER_PRODUCT_BOUGHT_ERROR,
} from './types';
import axios from 'axios';

export const loadUserProductsSold = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/product/listUser');

    dispatch({
      type: USER_PRODUCT_SOLD_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: USER_PRODUCT_SOLD_ERROR,
    });
  }
};

export const loadUserProductsBought = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/user/investProduct');

    dispatch({
      type: USER_PRODUCT_BOUGHT_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: USER_PRODUCT_BOUGHT_ERROR,
    });
  }
};
