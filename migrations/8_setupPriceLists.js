/*jshint esversion: 6 */

let KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");
let KimlicContextStorage = artifacts.require("./KimlicContextStorage.sol");
let PriceList = artifacts.require("./PriceList.sol");

let { getDeployConfig, getFormatedConsoleLable, emptyAddress, accountFields } = require("./Helpers/MigrationHelper");

module.exports = function(deployer, network, accounts) {
    let deployConfig = getDeployConfig(deployer, network, accounts);

    deployer.then(async () => {
        let kimlicContextStorageInstance = await KimlicContextStorage.deployed(); 

        let contextAddress = await kimlicContextStorageInstance.getContext();
        let context = await KimlicContractsContext.at(contextAddress);

        let provisioningPriceListAddress = await context.getProvisioningPriceList();
        if(provisioningPriceListAddress != emptyAddress){
            let provisioningPriceList = await PriceList.at(provisioningPriceListAddress);
            await setupPriceListInstance(provisioningPriceList, "Provisioning pricelist instance");
        }

        let verificationPriceListAddress = await context.getVerificationPriceList();
        if(verificationPriceListAddress != emptyAddress){
            let verificationPriceList = await PriceList.at(verificationPriceListAddress);
            await setupPriceListInstance(verificationPriceList, "Verification pricelist instance");
        }
    });

    let setupPriceListInstance = async (instance, contractCaption) => {//TODO replace by reading from config
        console.log(getFormatedConsoleLable(`setup ${contractCaption}`));

        for (let i = 0; i < accountFields.length; i++) {
            let price = 4 * Math.floor(1 + Math.random() * 5);
            console.log(`"${accountFields[i]}" price = ${price} tokens`); 
            await instance.setPrice(accountFields[i], price, deployConfig);
        }
    };
};
