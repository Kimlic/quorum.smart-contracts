/*jshint esversion: 6 */
const ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
const { getFormatedConsoleLabel, setValueByPath, getValueByPath, combinePath } = require("../commonLogic/commonLogic");
const { saveDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");

// Parameters

const emailPhoneVerificationIterests = {
  communityTokenWallet: 0,
  coOwner: 0,
  kimlicWallet: 80,
  account: 20,
}

const documentVerificationInterests = {
  communityTokenWallet: 10,
  coOwner: 20,
  kimlicWallet: 50,
  account: 20,
}

/**
 * Initial setup of ProvisioningContractFactory, definition of cashflow split per attribute
 */
module.exports = function (deployer) {
  console.log(getFormatedConsoleLabel("Setup provisioning contract factory instance:"));

  deployer.then(async () => {
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);
    const configPath = deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path;
    const accountFields = getValueByPath(deployedConfig, configPath);

    accountFields.forEach(async (fieldName) => {
      if (fieldName == "device") return

      const provisioningContractFactoryInstance = await ProvisioningContractFactory.deployed();
      let interests = (fieldName == "email" || fieldName == "phone" ? emailPhoneVerificationIterests : documentVerificationInterests);

      console.log(JSON.stringify(interests, null, 4));
      await provisioningContractFactoryInstance.setInterestsPercent(
        fieldName, 
        interests.communityTokenWallet, 
        interests.coOwner, 
        interests.kimlicWallet, 
        interests.account
      );

      const path = deployedConfigPathConsts.provisioningContractFactory.accountField.intersets.pathTemplate;
      const configPath = combinePath(path, { accountField: fieldName })
      setValueByPath(deployedConfig, configPath, interests);
      
      saveDeployedConfig();
    });
  });
};
