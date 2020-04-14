import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/marketplace'>
          <i className='fa fa-building'></i>
          <span className='hide-sm'> Marketplace</span>
        </Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fa fa-user'></i>
          <span className='hide-sm'> Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to='/tokenSale'>
          <i className='fa fa-cart-arrow-down'></i>
          <span className='hide-sm'> Token Sale</span>
        </Link>
      </li>
      <li>
        <Link to='/login' onClick={logout}>
          <i className='fa fa-sign-out-alt'></i>
          <span className='hide-sm'> Logout</span>
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/marketplace'>
          <i className='fa fa-building'></i>
          <span className='hide-sm'> Marketplace</span>
        </Link>
      </li>
      <li>
        <Link to='/register'>
          <i className='fa fa-user-plus'></i>
          <span className='hide-sm'> Register</span>
        </Link>
      </li>
      <li>
        <Link to='/login'>
          <i className='fa fa-sign-in'></i>
          <span className='hide-sm'> Login</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fa fa-usd'></i> Tokenizer
        </Link>
      </h1>
      {!loading && (
        <Fragment> {isAuthenticated ? authLinks : guestLinks} </Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
