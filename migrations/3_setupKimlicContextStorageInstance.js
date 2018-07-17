/*jshint esversion: 6 */

let KimlicContextStorage = artifacts.require("./KimlicContextStorage.sol");
let KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");

let { getDeployConfig, getFormatedConsoleLable } = require("./Helpers/MigrationHelper");

module.exports = function(deployer, network, accounts) {
    console.log(getFormatedConsoleLable("Setup kimlic context storage instance:"));
    let deployConfig = getDeployConfig(deployer, network, accounts);

    deployer.then(async () => {
        let kimlicContextStorageInstance = await KimlicContextStorage.deployed();
        let kimlicContractsContextInstance = await KimlicContractsContext.deployed();
        console.log("Context = " + kimlicContractsContextInstance.address);
        await kimlicContextStorageInstance.setContext(kimlicContractsContextInstance.address, deployConfig);
    });


};
