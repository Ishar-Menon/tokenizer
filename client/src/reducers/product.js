import {
  PRODUCT_REGISTER_FAIL,
  PRODUCT_REGISTER_SUCCESS,
} from "../actions/types";

const initialState = {
  productCreated: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PRODUCT_REGISTER_SUCCESS:
      return { ...state, productCreated: true };
    case PRODUCT_REGISTER_FAIL:
      return { ...state, productCreated: false };
    default:
      return state;
  }
}
