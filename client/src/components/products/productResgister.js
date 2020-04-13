import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const ProductRegister = ({ register, setAlert, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    product_name: "",
    totalTokens: "",
    tokenPrice: "",
    shortDecription: "",
    productDescription: "",
    productImages: [],
  });

  const {
    product_name,
    totalTokens,
    tokenPrice,
    shortDecription,
    productDescription,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    // if (password !== password2) {
    //   setAlert("Passwords do not match", "danger");
    // } else {
    //   register({ username, email, password, Eth_wallet_id });
    // }
  };

  // Redirect
  //   if (isAuthenticated) {
  //     return <Redirect to='/dashboard' />;
  //   }

  const fileUploadHandler = (event) => {
    let filesArray = [];
    for (var i = 0; i < event.target.files.length; i++) {
      console.log(event.target.files[i]);
      filesArray.push(event.target.files[i]);
    }
    setFormData({ ...formData, productImages: filesArray });
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Product sign up</h1>
      <p className='lead'>
        <i className='fa fa-bars'></i> register a new product for token sale
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Product name'
            name='productName'
            value={product_name}
            onChange={(e) => onChange(e)}
            // required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Total number of tokens'
            name='totalTokens'
            value={totalTokens}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Token price(in wei)'
            name='tokenPrice'
            value={tokenPrice}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Short decription of the product'
            name='shortDecription'
            value={shortDecription}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Detailed product Description'
            name='productDescription'
            value={productDescription}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='file'
            placeholder='Detailed product Description'
            name='productDescription'
            // value={productDescription}
            onChange={(e) => fileUploadHandler(e)}
            multiple
          />
        </div>
        <input type='submit' value='Register' className='btn btn-primary' />
      </form>
    </Fragment>
  );
};

ProductRegister.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register, setAlert })(
  ProductRegister
);
