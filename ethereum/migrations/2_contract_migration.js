var OnlineBetting = artifacts.require("./OnlineBetting.sol");

module.exports = function(deployer) {
  deployer.deploy(OnlineBetting);
};