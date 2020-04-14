import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import productRegister from './productRegister';
import userProducts from './userProducts';

export default combineReducers({
  auth,
  alert,
  productRegister,
  userProducts,
});
