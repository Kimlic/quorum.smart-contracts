/*jshint esversion: 6 */

const KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");
const KimlicContextStorage = artifacts.require("./KimlicContextStorage.sol");
const PriceList = artifacts.require("./PriceList.sol");

const { getFormatedConsoleLabel, getValueByPath, combinePath } = require("../commonLogic/commonLogic");
const { emptyAddress } = require("../commonLogic/commonEthereumLogic");
const { saveDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");

// Parameters

const provisioningPriceList = {
  "email": 0.5,
  "phone": 1,
  "documents.id_card": 2,
  "documents.passport": 2,
  "documents.driver_license": 2,
  "documents.residence_permit_card": 2,
  "addresses.billing": 1.5,
  "addresses.living": 1.5
}

const verificationPriceList = {
  "email": 0.5,
  "phone": 1,
  "documents.id_card": 2,
  "documents.passport": 2,
  "documents.driver_license": 2,
  "documents.residence_permit_card": 2,
  "addresses.billing": 1.5,
  "addresses.living": 1.5
}

/**
 * Initial setup of PriceList - definition of verification reward and provisioning cost for each attribute
 */
module.exports = function (deployer) {
  console.log(getFormatedConsoleLabel(`Setup pricelists`));
  const deployedConfig = getNetworkDeployedConfig(web3.version.network);

  const configPath = deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path;
  const accountFields = getValueByPath(deployedConfig, configPath);

  const priceLists = {
    provisioningPriceList: provisioningPriceList,
    verificationPriceList: verificationPriceList
  }

  deployer.then(async () => {
    const kimlicContextStorageInstance = await KimlicContextStorage.deployed();
    const contextAddress = await kimlicContextStorageInstance.getContext();
    const context = await KimlicContractsContext.at(contextAddress);
    const provisioningPriceListAddress = await context.getProvisioningPriceList();

    if (provisioningPriceListAddress != emptyAddress) {
      const provisioningPriceList = await PriceList.at(provisioningPriceListAddress);
      await setupPriceListInstance(provisioningPriceList, "provisioningPriceList");
    }

    const verificationPriceListAddress = await context.getVerificationPriceList();

    if (verificationPriceListAddress != emptyAddress) {
      const verificationPriceList = await PriceList.at(verificationPriceListAddress);
      await setupPriceListInstance(verificationPriceList, "verificationPriceList");
    }

    saveDeployedConfig();
  });

  const setupPriceListInstance = async (instance, contractCaption) => {
    const configPathTemplate = deployedConfigPathConsts.pricelistConfig.prices.pathTemplate;
    const configPath = combinePath(configPathTemplate, { pricelistName: contractCaption });
    const currentSetup = getValueByPath(deployedConfig, configPath);

    console.log(getFormatedConsoleLabel(`setup ${contractCaption} instance`));

    accountFields.forEach(async (fieldName) => {
      const price = priceLists[contractCaption][fieldName];
      console.log(`"${fieldName}" price = ${price} token(s)`);
      await instance.setPrice(fieldName, price * Math.pow(10, 18));//10^18 its token decimals
      currentSetup[fieldName] = price * Math.pow(10, 18);//10^18 its token decimals
    });
  };
};
