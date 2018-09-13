const AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");

const { addData } = require("../test/Helpers/AccountHelper.js");
const { getNetworkDeployedConfig, deployedConfigPathConsts, saveDeployedConfig } = require("../deployedConfigHelper");
const { getValueByPath } = require("../commonLogic/commonLogic");

// Parameters

const password = "p@ssw0rd"

/**
 * Utility to speed up creation of new user account for dev & test purpose
 */
module.exports = async function (callback) {
  const deployedConfig = getNetworkDeployedConfig(web3.version.network);
  const accountAllowedFieldNamesConfigPath = deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path;
  const accountAllowedFieldNamesConfig = getValueByPath(deployedConfig, accountAllowedFieldNamesConfigPath, []);
  const deployedContractsPath = deployedConfigPathConsts.deployedContracts.path;
  const deployedContractsConfig = getValueByPath(deployedConfig, deployedContractsPath, {});
  let adapter = await AccountStorageAdapter.at(deployedContractsConfig.accountStorageAdapterAddress);

  let address = web3.personal.newAccount(password);
  console.log(`Created new account address: "${address}", password: "${password}"`);
  // web3.personal.unlockAccount(address, password);
  console.log("Account unlocked");

  await accountAllowedFieldNamesConfig.forEach(async fieldName => {
    const value = fieldName + "Value";
    await addData(adapter, fieldName, fieldName, address);
    console.log(`set field "${fieldName}" with value ${value}`);
  });

  const createdUsers = getValueByPath(deployedConfig, deployedConfigPathConsts.createdUsers.path, []);
  createdUsers.push({ address: address, password: password });
  saveDeployedConfig();
  callback.call();
}