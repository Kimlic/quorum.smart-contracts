/*jshint esversion: 6 */

const AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
const { getFormatedConsoleLabel, setValueByPath } = require("../commonLogic/commonLogic");
const { saveDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");

// Parameters

const accountFields = [
  "email",
  "phone",
  "documents.id_card",
  "documents.passport",
  "documents.driver_license",
  "documents.residence_permit_card",
  "addresses.billing",
  "addresses.living",
  "device"
]

/**
 * initialization of AccountStorageAdapter with list of valid user profile attributes
 */
module.exports = function (deployer) {
  console.log(getFormatedConsoleLabel("Setup account storage adapter instance:"));

  deployer.then(async () => {
    const accountStorageAdapterInstance = await AccountStorageAdapter.deployed();
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);

    accountFields.forEach(async (accountField) => {
      console.log(`Add allowed field name "${accountField}"`);
      await accountStorageAdapterInstance.addAllowedFieldName(accountField);
    });

    setValueByPath(deployedConfig, deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path, accountFields);
    saveDeployedConfig();
  });
};
