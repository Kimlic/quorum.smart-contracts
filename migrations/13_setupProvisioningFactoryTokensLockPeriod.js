/*jshint esversion: 6 */
const ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");

const { getFormatedConsoleLabel, setValueByPath, getValueByPath, combinePath } = require("../commonLogic/commonLogic");
const { saveDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");

// Parameters

const tokensLockPeriod = {
  "email": 5,
  "phone": 2,
  "documents.id_card": 30,
  "documents.passport": 30,
  "documents.driver_license": 30,
  "documents.residence_permit_card": 30,
  "addresses.billing": 30,
  "addresses.living": 30
}

/**
 * Definition of tokens lock timeframe at ProvisionContract for each attribute
 */
module.exports = function (deployer) {
  console.log(getFormatedConsoleLabel("Setup provisioning contract factory tokens lock period:"));

  deployer.then(async () => {
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);
    const configPath = deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path;
    const accountFields = getValueByPath(deployedConfig, configPath);
    const provisioningContractFactoryInstance = await ProvisioningContractFactory.deployed();

    for (fieldName of accountFields) {
      if (fieldName == "device") return

      const lockPeriod = tokensLockPeriod[fieldName];
      console.log(`${fieldName} lock period: ${lockPeriod}`);
      provisioningContractFactoryInstance.setTokensLockPeriod(fieldName, lockPeriod);

      const path = deployedConfigPathConsts.provisioningContractFactory.accountField.tokensLockPeriod.pathTemplate;
      const configPath = combinePath(path, { accountField: fieldName })
      setValueByPath(deployedConfig, configPath, lockPeriod);

      saveDeployedConfig();
    }
  })
}
