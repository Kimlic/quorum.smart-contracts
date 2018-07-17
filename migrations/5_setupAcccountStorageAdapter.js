/*jshint esversion: 6 */

let AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");

let { getDeployConfig, getFormatedConsoleLable, accountFields } = require("./Helpers/MigrationHelper");

module.exports = function(deployer, network, accounts) {
    console.log(getFormatedConsoleLable("Setup account storage adapter instance:"));
    
    let deployConfig = getDeployConfig(deployer, network, accounts);
    deployer.then(async () => {
        let accountStorageAdapterInstance = await AccountStorageAdapter.deployed();
        for (let i = 0; i < accountFields.length; i++) {
            console.log(`Add allowed field name "${accountFields[i]}"`);
            await accountStorageAdapterInstance.addAllowedFieldName(accountFields[i], deployConfig);
        }
    });
};
