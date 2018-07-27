/*jshint esversion: 6 */

let KimlicContextStorage = artifacts.require("./KimlicContextStorage.sol");
let KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");

let { getFormatedConsoleLabel } = require("../commonLogic");

module.exports = function(deployer) {
    console.log(getFormatedConsoleLabel("Setup kimlic context storage instance:"));

    deployer.then(async () => {
        let kimlicContextStorageInstance = await KimlicContextStorage.deployed();
        let kimlicContractsContextInstance = await KimlicContractsContext.deployed();
        console.log("Context = " + kimlicContractsContextInstance.address);
        await kimlicContextStorageInstance.setContext(kimlicContractsContextInstance.address);
    });
};
