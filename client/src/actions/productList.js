import axios from "axios";
import { setAlert } from "./alert";
import {
  PRODUCT_LIST_AVAILABLE,
  PRODUCT_SELECTED,
  PRODUCT_NOT_SELECTED,
} from "./types";

// Create product
export const getProductData = (skipAmount) => async (dispatch) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  console.log("Inside get product data function", skipAmount);
  const body = JSON.stringify({
    skipAmount,
  });

  try {
    const res = await axios.post("/api/product/list", body, config);
    // console.log(res.data);

    dispatch({
      type: PRODUCT_LIST_AVAILABLE,
      payload: res.data,
    });
  } catch (error) {
    alert(error);
    const errors = error.response.data.errors;

    dispatch(setAlert(errors.general, "danger"));
  }
};

export const setSelectedProductIndex = (productIndex) => async (dispatch) => {
  dispatch({
    type: PRODUCT_SELECTED,
    payload: productIndex,
  });
};

export const unselectProduct = () => async (dispatch) => {
  //   alert("Hello");
  dispatch({
    type: PRODUCT_NOT_SELECTED,
  });
};
