var Migrations = artifacts.require("./Migrations.sol");
let { getDeployConfig } = require("./Helpers/MigrationHelper");

module.exports = function(deployer, network, accounts) {
  let deployConfig = getDeployConfig(deployer, network, accounts);
  deployer.deploy(Migrations, deployConfig);
};
