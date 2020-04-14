import axios from 'axios';
import { setAlert } from './alert';
import { PRODUCT_REGISTER_FAIL, PRODUCT_REGISTER_SUCCESS } from './types';
import { loadUserProductsSold } from './userProducts';

// Create product
export const createProduct = (
  product_name,
  totalTokens,
  tokenPrice,
  shortDescription,
  productDescription,
  productImages
) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  //   console.log(productImages);
  const body = JSON.stringify({
    product_name,
    totalTokens,
    tokenPrice,
    shortDescription,
    productDescription,
    productImages,
  });

  try {
    const res = await axios.post('/api/product/create', body, config);

    dispatch({
      type: PRODUCT_REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUserProductsSold());
  } catch (error) {
    const errors = error.response.data.errors;

    dispatch(setAlert(errors.general, 'danger'));

    dispatch({
      type: PRODUCT_REGISTER_FAIL,
    });
  }
};
