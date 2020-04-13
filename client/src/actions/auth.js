import axios from 'axios';
import {
  USER_LOADED,
  AUTH_ERROR,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/user/info');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register or sign up user
export const register = ({
  username,
  email,
  password,
  Eth_wallet_id,
}) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  const register_params = {
    tokens_owned: [],
    role: '',
  };

  const body = JSON.stringify({
    username,
    email,
    password,
    Eth_wallet_id,
    ...register_params,
  });

  try {
    const res = await axios.post('/api/user/create', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/user/login', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};
