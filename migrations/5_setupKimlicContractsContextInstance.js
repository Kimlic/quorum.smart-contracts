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

const { getFormatedConsoleLabel } = require("../commonLogic");
const { saveDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { setValueByPath } = require("../commonLogic");

module.exports = function(deployer) {
    console.log(getFormatedConsoleLabel("Setup kimlic contracts context instance:"));
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
        await kimlicContractsContextInstance.setAccountStorage(AccountStorage.address);
        
        console.log(`\nAccountStorageAdapter = ${AccountStorageAdapter.address}`);
        await kimlicContractsContextInstance.setAccountStorageAdapter(AccountStorageAdapter.address);
        
        console.log(`\nRelyingPartyStorageAdapter = ${RelyingPartyStorageAdapter.address}`);
        await kimlicContractsContextInstance.setRelyingPartyStorageAdapter(RelyingPartyStorageAdapter.address);
        
        console.log(`\nRelyingPartyStorage = ${RelyingPartyStorage.address}`);
        await kimlicContractsContextInstance.setRelyingPartyStorage(RelyingPartyStorage.address);
        
        console.log(`\nAttestationPartyStorageAdapter = ${AttestationPartyStorageAdapter.address}`);
        await kimlicContractsContextInstance.setAttestationPartyStorageAdapter(AttestationPartyStorageAdapter.address);
        
        console.log(`\nAttestationPartyStorage = ${AttestationPartyStorage.address}`);
        await kimlicContractsContextInstance.setAttestationPartyStorage(AttestationPartyStorage.address);
        
        console.log(`\nKimlicToken = ${KimlicToken.address}`);
        await kimlicContractsContextInstance.setKimlicToken(KimlicToken.address);
        
        console.log(`\nVerificationContractFactory = ${VerificationContractFactory.address}`);
        await kimlicContractsContextInstance.setVerificationContractFactory(VerificationContractFactory.address);
        
        const provisioningPriceListInstance = await deployer.deploy(PriceList);
        console.log(`\nProvisioningPriceList = ${provisioningPriceListInstance.address}`);
        await kimlicContractsContextInstance.setProvisioningPriceList(provisioningPriceListInstance.address);
        
        const verificationPriceListInstance = await deployer.deploy(PriceList);
        console.log(`\nVerificationPriceList = ${verificationPriceListInstance.address}`);
        await kimlicContractsContextInstance.setVerificationPriceList(verificationPriceListInstance.address);
        
        console.log(`\nProvisioningContractFactory = ${ProvisioningContractFactory.address}`);
        await kimlicContractsContextInstance.setProvisioningContractFactory(ProvisioningContractFactory.address);
        
        console.log(`\nCommunity token wallet address = ${communityTokenWalletAddress}`);
        await kimlicContractsContextInstance.setCommunityTokenWalletAddress(communityTokenWalletAddress);
        
        console.log(`\nRewardingContract = ${RewardingContract.address}`);
        await kimlicContractsContextInstance.setRewardingContract(RewardingContract.address);

    });
};
