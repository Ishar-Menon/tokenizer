const zorToken = artifacts.require("zorToken");

module.exports = function(deployer) {
  deployer.deploy(zorToken);
};
