/*jshint esversion: 6 */

let KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");
let KimlicContextStorage = artifacts.require("./KimlicContextStorage.sol");
let PriceList = artifacts.require("./PriceList.sol");

let { getTransactionConfig, getFormatedConsoleLabel, emptyAddress } = require("./Helpers/MigrationHelper");
const { saveDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { getValueByPath } = require("../commonLogic");


module.exports = function(deployer, network, accounts) {
    console.log(getFormatedConsoleLabel(`Setup pricelists`));
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);

    const configPath = deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path;
    const accountFields = getValueByPath(deployedConfig, configPath);
    
    let transactionConfig = getTransactionConfig(deployer, network, accounts);

    deployer.then(async () => {
        let kimlicContextStorageInstance = await KimlicContextStorage.deployed(); 

        let contextAddress = await kimlicContextStorageInstance.getContext();
        let context = await KimlicContractsContext.at(contextAddress);

        let provisioningPriceListAddress = await context.getProvisioningPriceList();
        if(provisioningPriceListAddress != emptyAddress){
            let provisioningPriceList = await PriceList.at(provisioningPriceListAddress);
            await setupPriceListInstance(provisioningPriceList, "provisioningPriceList");
        }

        let verificationPriceListAddress = await context.getVerificationPriceList();
        if(verificationPriceListAddress != emptyAddress){
            let verificationPriceList = await PriceList.at(verificationPriceListAddress);
            await setupPriceListInstance(verificationPriceList, "verificationPriceList");
        }
        saveDeployedConfig();
    });

    let setupPriceListInstance = async (instance, contractCaption) => {//TODO replace by reading from config
        const configPath = contractCaption + "Config.prices";
        const currentSetup = getValueByPath(deployedConfig, configPath);

        console.log(getFormatedConsoleLabel(`setup ${contractCaption} instance`));

        accountFields.forEach(async (fieldName) => {
            let price = 4 * Math.floor(1 + Math.random() * 5);
            console.log(`"${fieldName}" price = ${price} tokens`);
            await instance.setPrice(fieldName, price, transactionConfig);
            currentSetup[fieldName] = price;
        });
    };
};
