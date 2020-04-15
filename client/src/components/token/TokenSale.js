import React, { Fragment, useState, useEffect, useRef } from 'react';
import tokenSaleABI from '../../ABI/tokenSale.json';
import zorTokenABI from '../../ABI/zorToken.json';
import TruffleContract from 'truffle-contract';
import Web3 from 'web3';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const TokenSale = () => {
  const [contractInfo, setcontractInfoData] = useState({
    account: '0x0',
  });

  const [contracts, setContracts] = useState({
    zorTokenInstance: null,
    tokenSaleInstance: null,
  });

  const [tokens, setTokens] = useState({
    noOfTokens: '',
  });

  const [totalTokens, setTotalTokens] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);
  const [tokensRemaining, setTokensRemaining] = useState(0);

  const { noOfTokens } = tokens;
  const { zorTokenInstance, tokenSaleInstance } = contracts;
  const { account } = contractInfo;
  const tokenSale = TruffleContract(tokenSaleABI);
  const zorToken = TruffleContract(zorTokenABI);
  const tokenPrice = 1000000000000000;

  useInterval(() => {
    const web3Setup = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        zorToken.setProvider(window.ethereum);
        tokenSale.setProvider(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        zorToken.setProvider(window.web3.currentProvider);
        tokenSale.setProvider(window.web3.currentProvider);
      } else {
        window.alert(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        );
      }

      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const temp_zorTokenInstance = await zorToken.deployed();
      const temp_tokenSaleInstance = await tokenSale.deployed();
      // console.log(accounts);

      setContracts({
        zorTokenInstance: temp_zorTokenInstance,
        tokenSaleInstance: temp_tokenSaleInstance,
      });

      const tempTotalTokens = await temp_zorTokenInstance.totalSupply();
      setTotalTokens(tempTotalTokens.toNumber());

      const tempTokensSold = await temp_tokenSaleInstance.tokensSold();
      setTokensSold(tempTokensSold.toNumber());
      setTokensRemaining(
        tempTotalTokens.toNumber() - tempTokensSold.toNumber()
      );

      setcontractInfoData({
        ...contractInfo,
        account: accounts[0],
      });
    };

    web3Setup();
  }, 3000);

  const onChange = (e) => setTokens({ noOfTokens: [e.target.value] });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(tokenSaleInstance);
    await tokenSaleInstance.buyTokens(noOfTokens, {
      from: account,
      value: noOfTokens * tokenPrice,
    });

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const tempBought = parseInt(noOfTokens);

      const body = {
        tokensBought: {
          product_name: 'Mona Lisa',
          noTokensBought: tempBought,
        },
      };

      const res = await axios.post('/api/user/buyTokens', body, config);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Token Sale</h1>
      <div className='tokenSale'>
        <div className='product-info'>
          <img
            src='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
            alt=''
            className='round-img my-1 hide-sm'
          />

          <small className='owner text-primary'>Owner: </small>
          <p className='lead'>jdoe</p>
          <small className='desc text-primary'>Description: </small>
          <p className='desc'>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet
            quidem sed, delectus quasi totam velit accusantium officiis saepe
            quos fugit enim cupiditate tempore voluptatibus et voluptates,
            libero illum inventore. Rem.
          </p>
        </div>
        <div className='blockchain p-2'>
          <div className='tokens-info'>
            <small className='owner text-primary'>Total Tokens: </small>
            <p className='lead'>{totalTokens}</p>
            <small className='owner text-primary'>Tokens Sold: </small>
            <p className='lead'>{tokensSold}</p>
            <small className='owner text-primary'>Tokens Remaining: </small>
            <p className='lead'>{tokensRemaining}</p>
          </div>
          <div className='buy-form p-3'>
            <h1 className='lead text-primary'>Buy your tokens here!</h1>
            <form className='form' onSubmit={(e) => onSubmit(e)}>
              <div className='form-group'>
                <input
                  type='text'
                  placeholder='Enter the number of tokens'
                  value={noOfTokens}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <input type='submit' value='BUY' className='btn btn-primary' />
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

// TokenSale.propTypes = {

// }

// const mapStateToProps = state => {

// }

export default connect()(TokenSale);
