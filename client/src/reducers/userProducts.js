import {
  USER_PRODUCT_SOLD_LOADED,
  USER_PRODUCT_SOLD_ERROR,
  USER_PRODUCT_BOUGHT_LOADED,
  USER_PRODUCT_BOUGHT_ERROR,
  CLEAR_USER_PRODUCT,
} from '../actions/types';

const initialState = {
  loading: true,
  productsSold: null,
  productsBought: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_PRODUCT_SOLD_LOADED:
      return {
        ...state,
        productsSold: payload,
        loading: false,
      };
    case USER_PRODUCT_BOUGHT_LOADED:
      return {
        ...state,
        productsBought: payload,
        loading: false,
      };
    case USER_PRODUCT_SOLD_ERROR:
      return {
        ...state,
        loading: false,
        productsSold: null,
      };
    case USER_PRODUCT_BOUGHT_ERROR:
      return {
        ...state,
        loading: false,
        productsBought: null,
      };
    case CLEAR_USER_PRODUCT:
      return {
        ...state,
        productsSold: null,
        productsBought: null,
        loading: false,
      };
    default:
      return state;
  }
}
