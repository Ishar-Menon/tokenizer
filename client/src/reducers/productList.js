import {
  PRODUCT_LIST_AVAILABLE,
  PRODUCT_LIST_NOT_AVAILABLE,
  PRODUCT_SELECTED,
  PRODUCT_NOT_SELECTED,
} from "../actions/types";

const initialState = {
  productList: [],
  productDataAvailable: false,
  productSelected: false,
  productSelectedIndex: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  //   console.log("hello");
  //   console.log(payload);

  switch (type) {
    case PRODUCT_LIST_AVAILABLE:
      return { ...state, productList: payload, productDataAvailable: true };
    case PRODUCT_LIST_NOT_AVAILABLE:
      return { ...state, productList: [], productDataAvailable: false };
    case PRODUCT_SELECTED:
      return { ...state, productSelected: true, productSelectedIndex: payload };
    case PRODUCT_NOT_SELECTED:
      return { ...state, productSelected: false, productSelectedIndex: null };
    default:
      return state;
  }
}
