import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign into your account
      </p>
      <form className='form'>
        <div className='form-group'>
          <input type='email' placeholder='Email Address' />
        </div>
        <div className='form-group'>
          <input type='password' placeholder='Password' minLength='6' />
        </div>
        <input type='submit' value='Login' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

export default Login;
