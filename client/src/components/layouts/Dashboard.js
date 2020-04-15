import React, { Fragment, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "./Spinner";
import { unselectProduct } from "../../actions/productList";

const Dashboard = ({
  auth: { user },
  userProducts: { productsSold, productsBought, loading },
  unselectProduct,
}) => {
  const [toggleLinks, setToggleLinks] = useState(0);

  useEffect(() => {
    unselectProduct();
  });

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <div className='dashboard'>
        <div className='user-info'>
          <div className='img-container'>
            <img
              src='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
              alt=''
              className='round-img my-1 hide-sm'
            />
          </div>
          <div className='user-info-group'>
            <p className='text-primary'>Name:</p>
            <p>{user && user.username}</p>
          </div>
          <div className='user-info-group'>
            <p className='text-primary'>Email:</p>
            <p>{user && user.email}</p>
          </div>
          <div className='user-info-group'>
            <p className='text-primary'>Ethereum Wallet ID:</p>
            <p>{user && user.Eth_wallet_id}</p>
          </div>
          <div className='line'></div>
          <div className='dash-links'>
            <p
              name='productsSold'
              className='lead'
              onClick={(e) => setToggleLinks(1)}
            >
              Products Sold
            </p>
            <p
              name='productsBought'
              className='lead'
              onClick={(e) => setToggleLinks(2)}
            >
              Products Bought
            </p>
            <p
              name='analysis'
              className='lead'
              onClick={(e) => setToggleLinks(3)}
            >
              Statistical Analysis
            </p>
            <a href='/product/register'>
              <p name='RegisterProduct' className='lead'>
                Register Product
              </p>
            </a>
          </div>
        </div>
        {toggleLinks === 1 ? (
          <div className='user-products'>
            <h1 className='lead text-primary product p-4'>Products Sold</h1>
            {productsSold !== null &&
              productsSold.products !== null &&
              productsSold.products.map((product) => (
                <div key={product.product_name} className='product p-4'>
                  <img
                    src={product.productImages[0]}
                    alt=''
                    className='round-img my-1'
                  />
                  <div className='lead p-1'>{product.shortDescription}</div>
                </div>
              ))}
          </div>
        ) : toggleLinks === 2 ? (
          <div className='user-products'>
            <h1 className='lead text-primary product p-4'>Products Bought</h1>
            {productsBought !== null &&
              productsBought.products !== null &&
              productsBought.products.map((product) => (
                <div key={product.product_name} className='product p-4'>
                  <img
                    src={product.productImages[0]}
                    alt=''
                    className='round-img my-1'
                  />
                  <div className='lead p-1'>{product.shortDescription}</div>
                </div>
              ))}
          </div>
        ) : toggleLinks === 3 ? (
          <div className='user-products'>
            <h1 className='lead text-primary product p-4'>Analysis</h1>
          </div>
        ) : (
          <div className='user-products'>
            <h1 className='lead text-primary product p-4'>
              Use the links on the panel
            </h1>
          </div>
        )}
      </div>
    </Fragment>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  userProducts: PropTypes.object.isRequired,
  unselectProduct: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  userProducts: state.userProducts,
});

export default connect(mapStateToProps, { unselectProduct })(Dashboard);
