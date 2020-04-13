import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from './Spinner';

const Dashboard = ({ auth: { user, loading } }) => {
  console.log(user);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 class='large text-primary'>Dashboard</h1>
      <div class='dashboard'>
        <div class='user-info'>
          <div class='img-container'>
            <img
              src='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
              alt=''
              class='round-img my-1'
            />
          </div>
          <div class='user-info-group'>
            <p class='text-primary'>Name:</p>
            <p>{user && user.username}</p>
          </div>
          <div class='user-info-group'>
            <p class='text-primary'>Email:</p>
            <p>{user && user.email}</p>
          </div>
          <div class='user-info-group'>
            <p class='text-primary'>Ethereum Wallet ID:</p>
            <p>{user && user.Eth_wallet_id}</p>
          </div>
          <div class='line'></div>
          <div class='dash-links'>
            <a href='#' class='lead'>
              Products Sold
            </a>
            <a href='#' class='lead'>
              Products Bought
            </a>
            <a href='#' class='lead'>
              Statistical Analysis
            </a>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Dashboard);
