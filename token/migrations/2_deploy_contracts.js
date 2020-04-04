const zorToken = artifacts.require("zorToken");
const tokenSale = artifacts.require("tokenSale");

module.exports = function(deployer) {
  deployer.deploy(zorToken, 1000000).then(function() {
    var tokenPrice = 1000000000000000;
    return deployer.deploy(tokenSale, zorToken.address, tokenPrice);
  });
};
