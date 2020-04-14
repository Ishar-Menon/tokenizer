import { combineReducers } from "redux";
import auth from "./auth";
import alert from "./alert";
import product from "./product";

export default combineReducers({
  auth,
  alert,
  product,
});
