import React, { useState, useEffect } from 'react';
import tokenSaleABI from '../../ABI/tokenSale.json';
import zorTokenABI from '../../ABI/zorToken.json';
import TruffleContract from 'truffle-contract';
import Web3 from 'web3';

const TokenSale = () => {
  const [contractInfo, setcontractInfoData] = useState({
    account: '0x0',
  });

  const { account } = contractInfo;
  const tokenSale = TruffleContract(tokenSaleABI);
  const zorToken = TruffleContract(zorTokenABI);
  let tokenSaleInstance = null;
  let zorTokenInstance = null;

  useEffect(() => {
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
      tokenSaleInstance = await tokenSale.deployed();
      zorTokenInstance = await zorToken.deployed();

      console.log(tokenSaleInstance);
      console.log(zorTokenInstance);

      setcontractInfoData({
        ...contractInfo,
        account: accounts[0],
      });
    };

    web3Setup();
  }, []);
  return <div></div>;
};

export default TokenSale;
