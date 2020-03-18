const zorToken = artifacts.require("zorToken");
const tokenSale = artifacts.require("tokenSale");

module.exports = function(deployer) {
  deployer.deploy(zorToken, 1000000);
  deployer.deploy(tokenSale, 1000000);
};
