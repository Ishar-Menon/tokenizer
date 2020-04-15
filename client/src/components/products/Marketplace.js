import React, { Fragment, useState, useEffect } from "react";
import { getProductData } from "../../actions/productList";
import { setSelectedProductIndex } from "../../actions/productList";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import PropTypes from "prop-types";

const Marketplace = ({
  getProductData,
  auth,
  productList,
  setSelectedProductIndex,
}) => {
  useEffect(() => {
    if (productList.productDataAvailable) {
      console.log(productList);
    } else {
      getProductData(0);
    }
  });

  if (productList.productSelected) {
    return <Redirect to='/dashboard' />;
  }

  const selectProduct = (event) => {
    const index = event.target.title;
    console.log(index);
    setSelectedProductIndex(event.target.title);
  };

  let counter = 0;
  return (
    <Fragment>
      <h1 class='large text-primary'>Marketplace</h1>
      <div class='marketplace'>
        {productList.productDataAvailable === true ? (
          <div className='user-products'>
            <h1 className='lead text-primary product p-4'>Products Sold</h1>
            {productList.productList.products.map((product) => (
              <div
                key={product.product_name}
                className='product p-4'
                value='hello'
                title={counter.toString()}
                onClick={(e) => {
                  selectProduct(e);
                }}
              >
                <img
                  src='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
                  alt=''
                  className='round-img my-1'
                  title={counter.toString()}
                />
                <div className='lead p-1' title={(counter++).toString()}>
                  {product.shortDecription}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='user-products'>
            <h1 className='lead text-primary product p-4'>
              No products avialable
            </h1>
          </div>
        )}
      </div>
    </Fragment>
  );
};

Marketplace.propTypes = {
  auth: PropTypes.object.isRequired,
  productList: PropTypes.object.isRequired,
  getProductData: PropTypes.func.isRequired,
  setSelectedProductIndex: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  productList: state.productList,
});

export default connect(mapStateToProps, {
  getProductData,
  setAlert,
  setSelectedProductIndex,
})(Marketplace);
