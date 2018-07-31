var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
    console.log(`this: ${ JSON.stringify(deployer)}`)
    deployer.deploy(Migrations);
};
