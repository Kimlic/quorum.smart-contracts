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
var PriceList = artifacts.require("./PriceList.sol");
var RewardingContract = artifacts.require("./RewardingContract.sol");
var RelyingPartyStorageAdapter = artifacts.require("./RelyingPartyStorageAdapter.sol");
var RelyingPartyStorage = artifacts.require("./RelyingPartyStorage.sol");
var AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");
var AttestationPartyStorage = artifacts.require("./AttestationPartyStorage.sol");

module.exports = function(deployer, network, accounts) {
    let createdUsersFileName = "CreatedUsers.json";

    if(fs.existsSync(createdUsersFileName)) {
        fs.unlink(createdUsersFileName);
    }
    
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

    let kimlicContextStorageInstance;
    let kimlicContractsContextInstance;
    let provisioningContractFactoryInstance;
    let rewardingContractInstance;
    let provisioningPriceListInstance;
    let accountStorageAdapterInstance;
    let verificationPriceListInstance;

    let accountColumns = [
        "identity",//TODO probably we dont need this column anymore
        "email",
        "phone",
        "documents.id_card",
        "documents.passport",
        "documents.driver_license",
        "documents.residence_permit_card",
        "addresses.billing",
        "addresses.living",
        "device"//TODO probably we dont need this column anymore
    ]

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
    .then((instance) => {
        accountStorageAdapterInstance = instance;
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
        return deployer.deploy(PriceList, deployConfig);
    })
    .then((instance) => {
        provisioningPriceListInstance = instance;
        return deployer.deploy(PriceList, deployConfig);
    })
    .then((instance) => {
        verificationPriceListInstance = instance;
        return deployer.deploy(RewardingContract, KimlicContextStorage.address, deployConfig);
    })
    .then(async (instance) => {
        rewardingContractInstance = instance;

        await setupKimlicContextStorageInstance();
        await setupKimlicContractsContextInstance();
        await setupAcccountStorageAdapter();
        await setupProvisioningContractFactoryInstance();
        await setupRewardingContractInstance();
        await setupPriceListInstance(provisioningPriceListInstance, "provisioning pricelist instance");
        await setupPriceListInstance(verificationPriceListInstance, "verification pricelist instance");
        await setupCommunityTokenWalletAddress();


        let partiesConfig = {};

        let veriffName = "Veriff";
        await setupParty(partiesConfig, veriffName, veriffName + "p@ssw0rd");
        
        let kimlicName = "Kimlic";
        await setupParty(partiesConfig, kimlicName, kimlicName + "p@ssw0rd");

        let relyingPartyNme = "FirstRelyingParty";
        await setupParty(partiesConfig, relyingPartyNme, relyingPartyNme + "p@ssw0rd");

        savePartiesConfig(partiesConfig);
    });

    var setupAcccountStorageAdapter = async () => {

        console.log(getFormatedConsoleLable("Setup account storage adapter instance:"));

        for (let i = 0; i < accountColumns.length; i++) {            
            console.log(`Add allowed column name "${accountColumns[i]}"`);
            await accountStorageAdapterInstance.addAllowedColumnName(accountColumns[i]);
        }
    };

    var setupKimlicContextStorageInstance = async () => {

        console.log(getFormatedConsoleLable("Setup kimlic context storage instance:"));
        console.log("Context = " + kimlicContractsContextInstance.address);
        await kimlicContextStorageInstance.setContext(kimlicContractsContextInstance.address, deployConfig);
    };
    
    var setupKimlicContractsContextInstance = async () => {
        
        console.log(getFormatedConsoleLable("Setup kimlic contracts context instance:"));
        
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
        
        console.log(`\nVerificationContractFactory = ${VerificationContractFactory.address}`);
        await kimlicContractsContextInstance.setVerificationContractFactory(VerificationContractFactory.address, deployConfig);
        
        console.log(`\nProvisioningPriceList = ${provisioningPriceListInstance.address}`);
        await kimlicContractsContextInstance.setProvisioningPriceList(provisioningPriceListInstance.address, deployConfig);
        
        console.log(`\nVerificationPriceList = ${verificationPriceListInstance.address}`);
        await kimlicContractsContextInstance.setVerificationPriceList(verificationPriceListInstance.address, deployConfig);
        
        console.log(`\nProvisioningContractFactory = ${ProvisioningContractFactory.address}`);
        await kimlicContractsContextInstance.setProvisioningContractFactory(ProvisioningContractFactory.address, deployConfig);
        
        console.log(`\nCommunity token wallet address = ${communityTokenWalletAddress}`);
        await kimlicContractsContextInstance.setCommunityTokenWalletAddress(communityTokenWalletAddress, deployConfig);
        
        console.log(`\nRewardingContract = ${RewardingContract.address}`);
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
        console.log(`set milestone 1 reward = ${rewards.mielstone1}`);
        await rewardingContractInstance.setMilestone1Reward(rewards.mielstone1, deployConfig);
        
        console.log(`set milestone 2 reward = ${rewards.mielstone2}`);
        await rewardingContractInstance.setMilestone2Reward(rewards.mielstone2, deployConfig);
    };
    
    var setupPriceListInstance = async (instance, contractCaption) => {
        console.log(getFormatedConsoleLable(`setup ${contractCaption}`));

        for (let i = 0; i < accountColumns.length; i++) {
            let price = 4 * Math.floor(1 + Math.random() * 5);
            console.log(`"${accountColumns[i]}" price = ${price} tokens`); 
            await instance.setPrice(accountColumns[i], price, deployConfig);
        }
    };

    let setupCommunityTokenWalletAddress = async () => {
        let kimlicToken = await KimlicToken.deployed();
        console.log("Approve rewarding contract to spend tokens from community token wallet");
        await kimlicToken.approve(RewardingContract.address, 1000000000, { form: communityTokenWalletAddress });//TODO unlock address
    };

    let savePartiesConfig = (config) => {
        console.log(`Saving parties config into file "${partiesConfigFileName}"`);
        fs.writeFileSync(partiesConfigFileName, JSON.stringify(config));
    }
    

    let setupParty = async (partiesConfig, name, password) => {
        let address = web3.personal.newAccount(password);
        console.log(`Created new "${name}" party address: "${address}", password: "${password}"`);
        web3.personal.unlockAccount(address, password);

        //TODO probably we dont need this step in newer version of Quourum
        console.log("Sending eth to created address");
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

        console.log(`Approve to ProvisioningContractFactory spend "${name}" tokens`);
        await kimlicToken.approve(ProvisioningContractFactory.address, 10000, { from: address });

        let provisioningAllowance = await kimlicToken.allowance.call(address, ProvisioningContractFactory.address, { from: address });
        console.log(`Allowance from "${address}" to provisioning contract factory at address "${ProvisioningContractFactory.address}" - ${provisioningAllowance}`);

        partiesConfig[name] = { address: address, password: password };

        return address;
    };
    
    let getFormatedConsoleLable = function(unformatedLable){
        var separationString = "=".repeat(10);
        return "\n" + separationString + " " + unformatedLable + " " + separationString + "\n";
    };
};
