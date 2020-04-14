import axios from "axios";
import { setAlert } from "./alert";
import { PRODUCT_REGISTER_FAIL, PRODUCT_REGISTER_SUCCESS } from "./types";
import setAuthToken from "../utils/setAuthToken";

// Create product
export const createProduct = (
  product_name,
  totalTokens,
  tokenPrice,
  shortDecription,
  productDescription,
  productImages
) => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  //   console.log(productImages);
  const body = JSON.stringify({
    product_name,
    totalTokens,
    tokenPrice,
    shortDecription,
    productDescription,
    productImages,
  });

  try {
    const res = await axios.post("/api/product/create", body, config);

    dispatch({
      type: PRODUCT_REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    dispatch(setAlert(errors.general, "danger"));

    dispatch({
      type: PRODUCT_REGISTER_FAIL,
    });
  }
};
