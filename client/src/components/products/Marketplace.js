import React, { Fragment } from 'react';

const Marketplace = () => {
  return (
    <Fragment>
      <h1 class='large text-primary'>Marketplace</h1>
      <div class='marketplace'>
        <a href='#' class='href'>
          <div class='product p-4'>
            <img
              src='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
              alt=''
              class='round-img my-1'
            />
            <div class='desc p-2'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere,
              doloremque!
            </div>
          </div>
        </a>
        <a href='#' class='href'>
          <div class='product p-4'>
            <img
              src='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
              alt=''
              class='round-img my-1'
            />
            <div class='desc p-2'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere,
              doloremque!
            </div>
          </div>
        </a>
      </div>
    </Fragment>
  );
};

export default Marketplace;
