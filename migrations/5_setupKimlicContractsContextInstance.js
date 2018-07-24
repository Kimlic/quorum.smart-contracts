/*jshint esversion: 6 */

const AccountStorage = artifacts.require("./AccountStorage.sol");
const KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");
const AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
const VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
const ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
const KimlicToken = artifacts.require("./KimlicToken.sol");
const PriceList = artifacts.require("./PriceList.sol");
const RewardingContract = artifacts.require("./RewardingContract.sol");
const RelyingPartyStorageAdapter = artifacts.require("./RelyingPartyStorageAdapter.sol");
const RelyingPartyStorage = artifacts.require("./RelyingPartyStorage.sol");
const AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");
const AttestationPartyStorage = artifacts.require("./AttestationPartyStorage.sol");

const { getTransactionConfig, getFormatedConsoleLabel } = require("./Helpers/MigrationHelper");
const { saveDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { setValueByPath } = require("../commonLogic");

module.exports = function(deployer, network, accounts) {
    console.log(getFormatedConsoleLabel("Setup kimlic contracts context instance:"));
    
    const transactionConfig = getTransactionConfig(deployer, network, accounts);


    deployer.then(async () => {
        
        const communityTokenWalletPassword = "p@ssw0rd";
        const communityTokenWalletAddress = web3.personal.newAccount(communityTokenWalletPassword);
        web3.personal.unlockAccount(communityTokenWalletAddress, communityTokenWalletPassword, 100);
        await web3.eth.sendTransaction({"from": web3.eth.coinbase, "to": communityTokenWalletAddress, "value": 1000000000000000000});//1 eth

        const deployedConfig = getNetworkDeployedConfig(web3.version.network);
        setValueByPath(deployedConfig, deployedConfigPathConsts.communityTokenWallet.path, {
            address: communityTokenWalletAddress, password: communityTokenWalletPassword
        });
        saveDeployedConfig();

        const kimlicContractsContextInstance = await KimlicContractsContext.deployed();
        
        console.log(`\nAccountStorageAddress = ${AccountStorage.address}`);
        await kimlicContractsContextInstance.setAccountStorage(AccountStorage.address, transactionConfig);
        
        console.log(`\nAccountStorageAdapter = ${AccountStorageAdapter.address}`);
        await kimlicContractsContextInstance.setAccountStorageAdapter(AccountStorageAdapter.address, transactionConfig);
        
        console.log(`\nRelyingPartyStorageAdapter = ${RelyingPartyStorageAdapter.address}`);
        await kimlicContractsContextInstance.setRelyingPartyStorageAdapter(RelyingPartyStorageAdapter.address, transactionConfig);
        
        console.log(`\nRelyingPartyStorage = ${RelyingPartyStorage.address}`);
        await kimlicContractsContextInstance.setRelyingPartyStorage(RelyingPartyStorage.address, transactionConfig);
        
        console.log(`\nAttestationPartyStorageAdapter = ${AttestationPartyStorageAdapter.address}`);
        await kimlicContractsContextInstance.setAttestationPartyStorageAdapter(AttestationPartyStorageAdapter.address, transactionConfig);
        
        console.log(`\nAttestationPartyStorage = ${AttestationPartyStorage.address}`);
        await kimlicContractsContextInstance.setAttestationPartyStorage(AttestationPartyStorage.address, transactionConfig);
        
        console.log(`\nKimlicToken = ${KimlicToken.address}`);
        await kimlicContractsContextInstance.setKimlicToken(KimlicToken.address, transactionConfig);
        
        console.log(`\nVerificationContractFactory = ${VerificationContractFactory.address}`);
        await kimlicContractsContextInstance.setVerificationContractFactory(VerificationContractFactory.address, transactionConfig);
        
        const provisioningPriceListInstance = await deployer.deploy(PriceList, transactionConfig);
        console.log(`\nProvisioningPriceList = ${provisioningPriceListInstance.address}`);
        await kimlicContractsContextInstance.setProvisioningPriceList(provisioningPriceListInstance.address, transactionConfig);
        
        const verificationPriceListInstance = await deployer.deploy(PriceList, transactionConfig);
        console.log(`\nVerificationPriceList = ${verificationPriceListInstance.address}`);
        await kimlicContractsContextInstance.setVerificationPriceList(verificationPriceListInstance.address, transactionConfig);
        
        console.log(`\nProvisioningContractFactory = ${ProvisioningContractFactory.address}`);
        await kimlicContractsContextInstance.setProvisioningContractFactory(ProvisioningContractFactory.address, transactionConfig);
        
        console.log(`\nCommunity token wallet address = ${communityTokenWalletAddress}`);
        await kimlicContractsContextInstance.setCommunityTokenWalletAddress(communityTokenWalletAddress, transactionConfig);
        
        console.log(`\nRewardingContract = ${RewardingContract.address}`);
        await kimlicContractsContextInstance.setRewardingContract(RewardingContract.address, transactionConfig);

    });
};
