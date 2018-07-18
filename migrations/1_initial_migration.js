var Migrations = artifacts.require("./Migrations.sol");
let { getTransactionConfig } = require("./Helpers/MigrationHelper");

module.exports = function(deployer, network, accounts) {
    let transactionConfig = getTransactionConfig(deployer, network, accounts);
    deployer.deploy(Migrations, transactionConfig);
};
