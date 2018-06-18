/*jshint esversion: 6 */
var fs = require("fs");
var { getMainAccount } = require("../configReader");

var AccountStorage = artifacts.require("./AccountStorage.sol");
var KimlicContextStorage = artifacts.require("./KimlicContextStorage.sol");
var KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");
var AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
var VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
var ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
var KimlicToken = artifacts.require("./KimlicToken.sol");
var ProvisioningPrice = artifacts.require("./ProvisioningPrice.sol");
var RewardingContract = artifacts.require("./RewardingContract.sol");
var RelyingPartyStorageAdapter = artifacts.require("./RelyingPartyStorageAdapter.sol");
var RelyingPartyStorage = artifacts.require("./RelyingPartyStorage.sol");
var AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");
var AttestationPartyStorage = artifacts.require("./AttestationPartyStorage.sol");

module.exports = function(deployer, network, accounts) {
    let partiesConfigFileName = "PartiesConfig.json";
    var mainAccount = getMainAccount(network);

    var communityTokenWalletAddress = accounts[0];//TODO move to config

    if (mainAccount.address) {
        console.log('Account: ' + mainAccount.address);
        var unlockAccountRequest = {
            "jsonrpc": "2.0",
            "method": "personal_unlockAccount",
            "params": [mainAccount.address, mainAccount.password],
            "id": 1
        };
        console.log("send unlock request " + JSON.stringify(unlockAccountRequest));
        var response = deployer.provider.send(unlockAccountRequest);
        console.log("response: " + JSON.stringify(response));
    
    } else {
        mainAccount.address = accounts[0];
        console.log('Config account not found.\nAccount: ' + mainAccount.address);
    }

    var kimlicContextStorageInstance;
    var kimlicContractsContextInstance;
    var provisioningContractFactoryInstance;
    var rewardingContractInstance;
    var provisioningPriceInstance;

    var deployConfig = {
        "from": mainAccount.address
    };

    deployer.deploy(KimlicContextStorage, deployConfig).then((instance) => {
        kimlicContextStorageInstance = instance;
        return deployer.deploy(KimlicContractsContext, KimlicContextStorage.address, deployConfig);
    }).then((instance) => {
        kimlicContractsContextInstance = instance;
        return deployer.deploy(AccountStorage, KimlicContextStorage.address, deployConfig);
    })
    .then(() => {
        return deployer.deploy(AccountStorageAdapter, KimlicContextStorage.address, deployConfig);
    })
    .then(() => {
        return deployer.deploy(RelyingPartyStorageAdapter, KimlicContextStorage.address, deployConfig);
    })
    .then(() => {
        return deployer.deploy(RelyingPartyStorage, KimlicContextStorage.address, deployConfig);
    })
    .then(() => {
        return deployer.deploy(AttestationPartyStorageAdapter, KimlicContextStorage.address, deployConfig);
    })
    .then(() => {
        return deployer.deploy(AttestationPartyStorage, KimlicContextStorage.address, deployConfig);
    })
    .then(() => {
        
        return deployer.deploy(VerificationContractFactory, KimlicContextStorage.address, deployConfig);
    })
    .then(() => {
        return deployer.deploy(ProvisioningContractFactory, KimlicContextStorage.address, deployConfig);
    })
    .then((instance) => {
        provisioningContractFactoryInstance = instance;
        return deployer.deploy(KimlicToken, deployConfig);
    })
    .then(() => {
        return deployer.deploy(ProvisioningPrice, deployConfig);
    })
    .then((instance) => {
        provisioningPriceInstance = instance;
        return deployer.deploy(RewardingContract, KimlicContextStorage.address, deployConfig);
    })
    .then(async (instance) => {
        rewardingContractInstance = instance;

        await setupKimlicContextStorageInstance();
        await setupKimlicContractsContextInstance();
        await setupProvisioningContractFactoryInstance();
        await setupRewardingContractInstance();
        await setupProvisioningPriceInstance();
        await setupCommunityTokenWalletAddress();


        let partiesConfig = {};

        let veriffName = "Veriff";
        await setupAttestationParty(partiesConfig, veriffName, veriffName + "p@ssw0rd");
        
        let kimlicName = "Kimlic";
        await setupAttestationParty(partiesConfig, kimlicName, kimlicName + "p@ssw0rd");

        savePartiesConfig(partiesConfig);
    });

    var setupKimlicContextStorageInstance = async () => {

        console.log(getFormatedConsoleLable("Setup kimlic context storage instance:"));
        console.log("Context = " + kimlicContractsContextInstance.address);
        await kimlicContextStorageInstance.setContext(kimlicContractsContextInstance.address, deployConfig);
    };
    
    var setupKimlicContractsContextInstance = async () => {
        
        console.log(getFormatedConsoleLable("Setup kimlic contracts context instance:"));
        
        console.log("\nAccountStorageAddress = ", AccountStorage.address);
        await kimlicContractsContextInstance.setAccountStorage(AccountStorage.address, deployConfig);
        
        console.log("\nAccountStorageAdapter = ", AccountStorageAdapter.address);
        await kimlicContractsContextInstance.setAccountStorageAdapter(AccountStorageAdapter.address, deployConfig);
        
        console.log("\nRelyingPartyStorageAdapter = ", RelyingPartyStorageAdapter.address);
        await kimlicContractsContextInstance.setRelyingPartyStorageAdapter(RelyingPartyStorageAdapter.address, deployConfig);
        
        console.log("\nRelyingPartyStorage = ", RelyingPartyStorage.address);
        await kimlicContractsContextInstance.setRelyingPartyStorage(RelyingPartyStorage.address, deployConfig);
        
        console.log("\nAttestationPartyStorageAdapter = ", AttestationPartyStorageAdapter.address);
        await kimlicContractsContextInstance.setAttestationPartyStorageAdapter(AttestationPartyStorageAdapter.address, deployConfig);
        
        console.log("\nAttestationPartyStorage = ", AttestationPartyStorage.address);
        await kimlicContractsContextInstance.setAttestationPartyStorage(AttestationPartyStorage.address, deployConfig);
        
        console.log("\nKimlicToken = ", KimlicToken.address);
        await kimlicContractsContextInstance.setKimlicToken(KimlicToken.address, deployConfig);
        
        console.log("\nVerificationContractFactory = ", VerificationContractFactory.address);
        await kimlicContractsContextInstance.setVerificationContractFactory(VerificationContractFactory.address, deployConfig);
        
        console.log("\nProvisioningPrice = ", ProvisioningPrice.address);
        await kimlicContractsContextInstance.setProvisioningPrice(ProvisioningPrice.address, deployConfig);
        
        console.log("\nProvisioningContractFactory = ", ProvisioningContractFactory.address);
        await kimlicContractsContextInstance.setProvisioningContractFactory(ProvisioningContractFactory.address, deployConfig);
        
        console.log("\nCommunity token wallet address = ", communityTokenWalletAddress);
        await kimlicContractsContextInstance.setCommunityTokenWalletAddress(communityTokenWalletAddress, deployConfig);
        
        console.log("\nRewardingContract = ", RewardingContract.address);
        await kimlicContractsContextInstance.setRewardingContract(RewardingContract.address, deployConfig);
    };
    
    var setupProvisioningContractFactoryInstance = async () => {
        
        var interests = {
            communityTokenWallet: 25,
            coOwner: 25,
            attestationParty: 25,
            account: 25,
        };
        console.log(getFormatedConsoleLable("Setup provisioning contract factory instance:"));
        
        console.log(JSON.stringify(interests, null, 4));
        await provisioningContractFactoryInstance.setInterestsPercent(interests.communityTokenWallet,
            interests.coOwner, interests.attestationParty, interests.account, deployConfig);
    };
    
    var setupRewardingContractInstance = async () => {
        var rewards = {
            mielstone1: 15,
            mielstone2: 25
        };
        console.log(getFormatedConsoleLable("Setup rewarding contract instance:"));
        console.log("set milestone 1 reward = " + rewards.mielstone1);
        await rewardingContractInstance.setMilestone1Reward(rewards.mielstone1, deployConfig);
        
        console.log("set milestone 2 reward = " + rewards.mielstone2);
        await rewardingContractInstance.setMilestone2Reward(rewards.mielstone2, deployConfig);
    };
    
    var setupProvisioningPriceInstance = async () => {
        
        console.log(getFormatedConsoleLable("setupProvisioningPriceInstance"));
        var prices = {
            email: 10,
            phone: 15,
            identity: 12,
            documents: 22,
            addresses: 16
        };
        
        console.log("Email = " + prices.email);
        await provisioningPriceInstance.setPrice(0, prices.email, deployConfig);
        
        console.log("Phone = " + prices.phone);
        await provisioningPriceInstance.setPrice(1, prices.phone, deployConfig);
        
        console.log("Identity = " + prices.identity);
        await provisioningPriceInstance.setPrice(2, prices.identity, deployConfig);
        
        console.log("Documents = " + prices.documents);
        await provisioningPriceInstance.setPrice(4, prices.documents, deployConfig);
        
        console.log("Addresses = " + prices.addresses);
        await provisioningPriceInstance.setPrice(5, prices.addresses, deployConfig);
    };

    let setupCommunityTokenWalletAddress = async () => {
        let kimlicToken = await KimlicToken.deployed();
        await kimlicToken.approve(RewardingContract.address, 1000000000, { form: communityTokenWalletAddress });//TODO unlock address
    };

    let savePartiesConfig = (config) => {
        console.log(`Saving parties config into file "${partiesConfigFileName}"`);
        fs.writeFileSync(partiesConfigFileName, JSON.stringify(config));
    }
    

    let setupAttestationParty = async (partiesConfig, name, password) => {
        let address = web3.personal.newAccount(password);
        console.log(`Created new "${name}" party address: "${address}", password: "${password}"`);
        web3.personal.unlockAccount(address, password);

        //TODO probably we dont need this step in newer version of Quourum
        console.log(`Sending eth to created address`);
        web3.eth.sendTransaction({from: accounts[0], to: address, value: "0xDE0B6B3A7640000"});


        let kimlicToken = await KimlicToken.deployed();
        console.log(`Send tokens to "${name}" account`);
        await kimlicToken.transfer(address, 10000);
        
        var balance = await kimlicToken.balanceOf.call(address);
        console.log(`Balance of created account - "${balance}"`);

        console.log(`Approve to VerificationContractFactory spend "${name}" tokens`);
        await kimlicToken.approve(VerificationContractFactory.address, 10000, { from: address });

        let allowance = await kimlicToken.allowance.call(address, VerificationContractFactory.address, { from: address });
        console.log(`Allowance from "${address}" to verification contract factory at address "${VerificationContractFactory.address}" - ${allowance}`);

        partiesConfig[name] = { address: address, password: password };
    };
    
    let getFormatedConsoleLable = function(unformatedLable){
        var separationString = "=".repeat(10);
        return "\n" + separationString + " " + unformatedLable + " " + separationString + "\n";
    };
};
