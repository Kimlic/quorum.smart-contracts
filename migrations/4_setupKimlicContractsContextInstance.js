/*jshint esversion: 6 */

let AccountStorage = artifacts.require("./AccountStorage.sol");
let KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");
let AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
let VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
let ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
let KimlicToken = artifacts.require("./KimlicToken.sol");
let PriceList = artifacts.require("./PriceList.sol");
let RewardingContract = artifacts.require("./RewardingContract.sol");
let RelyingPartyStorageAdapter = artifacts.require("./RelyingPartyStorageAdapter.sol");
let RelyingPartyStorage = artifacts.require("./RelyingPartyStorage.sol");
let AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");
let AttestationPartyStorage = artifacts.require("./AttestationPartyStorage.sol");

let { getDeployConfig, getFormatedConsoleLable } = require("./Helpers/MigrationHelper");

module.exports = function(deployer, network, accounts) {
    console.log(getFormatedConsoleLable("Setup kimlic contracts context instance:"));
    
    let deployConfig = getDeployConfig(deployer, network, accounts);
    var communityTokenWalletAddress = accounts[0];//TODO move to config

    deployer.then(async () => {
        let kimlicContractsContextInstance = await KimlicContractsContext.deployed();
        
        console.log(`\nAccountStorageAddress = ${AccountStorage.address}`);
        await kimlicContractsContextInstance.setAccountStorage(AccountStorage.address, deployConfig);
        
        console.log(`\nAccountStorageAdapter = ${AccountStorageAdapter.address}`);
        await kimlicContractsContextInstance.setAccountStorageAdapter(AccountStorageAdapter.address, deployConfig);
        
        console.log(`\nRelyingPartyStorageAdapter = ${RelyingPartyStorageAdapter.address}`);
        await kimlicContractsContextInstance.setRelyingPartyStorageAdapter(RelyingPartyStorageAdapter.address, deployConfig);
        
        console.log(`\nRelyingPartyStorage = ${RelyingPartyStorage.address}`);
        await kimlicContractsContextInstance.setRelyingPartyStorage(RelyingPartyStorage.address, deployConfig);
        
        console.log(`\nAttestationPartyStorageAdapter = ${AttestationPartyStorageAdapter.address}`);
        await kimlicContractsContextInstance.setAttestationPartyStorageAdapter(AttestationPartyStorageAdapter.address, deployConfig);
        
        console.log(`\nAttestationPartyStorage = ${AttestationPartyStorage.address}`);
        await kimlicContractsContextInstance.setAttestationPartyStorage(AttestationPartyStorage.address, deployConfig);
        
        console.log(`\nKimlicToken = ${KimlicToken.address}`);
        await kimlicContractsContextInstance.setKimlicToken(KimlicToken.address, deployConfig);
        console.log("nKimlicToken address is: ", 
            await kimlicContractsContextInstance.getKimlicToken(deployConfig));
        
        console.log(`\nVerificationContractFactory = ${VerificationContractFactory.address}`);
        await kimlicContractsContextInstance.setVerificationContractFactory(VerificationContractFactory.address, deployConfig);
        
        let provisioningPriceListInstance = await deployer.deploy(PriceList, deployConfig);
        console.log(`\nProvisioningPriceList = ${provisioningPriceListInstance.address}`);
        await kimlicContractsContextInstance.setProvisioningPriceList(provisioningPriceListInstance.address, deployConfig);
        console.log("ProvisioningPriceList address is: ", 
            await kimlicContractsContextInstance.getProvisioningPriceList(deployConfig));
        
        let verificationPriceListInstance = await deployer.deploy(PriceList, deployConfig);
        console.log(`\nVerificationPriceList = ${verificationPriceListInstance.address}`);
        await kimlicContractsContextInstance.setVerificationPriceList(verificationPriceListInstance.address, deployConfig);
        console.log("verificationPriceList address is: ", 
            await kimlicContractsContextInstance.getVerificationPriceList(deployConfig));
        
        
        console.log(`\nProvisioningContractFactory = ${ProvisioningContractFactory.address}`);
        await kimlicContractsContextInstance.setProvisioningContractFactory(ProvisioningContractFactory.address, deployConfig);
        
        console.log(`\nCommunity token wallet address = ${communityTokenWalletAddress}`);
        await kimlicContractsContextInstance.setCommunityTokenWalletAddress(communityTokenWalletAddress, deployConfig);
        
        console.log(`\nRewardingContract = ${RewardingContract.address}`);
        await kimlicContractsContextInstance.setRewardingContract(RewardingContract.address, deployConfig);

    });
};
