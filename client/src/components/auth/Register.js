import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create your account
      </p>
      <form className='form'>
        <div className='form-group'>
          <input type='text' placeholder='Name' required />
        </div>
        <div className='form-group'>
          <input type='email' placeholder='Email Address' />
        </div>
        <div className='form-group'>
          <input type='password' placeholder='Password' minLength='6' />
        </div>
        <div className='form-group'>
          <input type='password' placeholder='Confirm password' minLength='6' />
        </div>
        <input type='submit' value='Register' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

export default Register;
