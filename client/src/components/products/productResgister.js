import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { createProduct } from "../../actions/product";
import PropTypes from "prop-types";
import axios from "axios";

const ProductRegister = ({ createProduct, setAlert, productCreated }) => {
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
    productImages,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const uploadData = async (
    product_name,
    totalTokens,
    tokenPrice,
    shortDecription,
    productDescription,
    productImages
  ) => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    console.log(productImages);
    const body = JSON.stringify({
      product_name,
      totalTokens,
      tokenPrice,
      shortDecription,
      productDescription,
      productImages,
    });

    try {
      const res = await axios.post("/api/product/create", body, config);

      // dispatch({
      //   type: REGISTER_SUCCESS,
      //   payload: res.data,
      // });

      // dispatch(loadUser());
    } catch (error) {
      const errors = error.response.data.errors;

      // dispatch(setAlert(errors.general, 'danger'));

      // dispatch({
      //   type: REGISTER_FAIL,
      // });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createProduct(
      product_name,
      totalTokens,
      tokenPrice,
      shortDecription,
      productDescription,
      productImages
    );
  };

  // Redirect;
  if (productCreated) {
    return <Redirect to='/dashboard' />;
  }

  const fileUploadHandler = async (event) => {
    // Save context
    let filesArray = [];
    let fileUploaded = event.target.files;
    let length = fileUploaded.length;

    let base64file = null;
    for (var i = 0; i < length; i++) {
      base64file = await toBase64(fileUploaded[i]);
      console.log(base64file);
      filesArray.push(base64file);
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
            name='product_name'
            value={product_name}
            onChange={(e) => onChange(e)}
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
  createProduct: PropTypes.func.isRequired,
  productCreated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  productCreated: state.product.productCreated,
});

export default connect(mapStateToProps, { createProduct, setAlert })(
  ProductRegister
);
