import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fa fa-usd'></i> Tokenizer
        </Link>
      </h1>
      <ul>
        <li>
          <Link to='/about'>
            <i className='fa fa-info'></i>
            &nbsp; About
          </Link>
        </li>
        <li>
          <Link to='/register'>
            <i className='fa fa-user-plus'></i>
            &nbsp; Register
          </Link>
        </li>
        <li>
          <Link to='/login'>
            <i className='fa fa-sign-in'></i>
            &nbsp; Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
