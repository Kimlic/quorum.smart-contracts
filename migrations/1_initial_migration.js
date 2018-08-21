var Migrations = artifacts.require("./Migrations.sol");

/**
 * 
 * Deployment of initial contract which tracks deployment of other contracts
 */
module.exports = function(deployer) {
    deployer.deploy(Migrations);
};
