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
var RelyingPartyStorageAdapter = artifacts.require("./RelyingPartyStorageAdapter.sol")
var RelyingPartyStorage = artifacts.require("./RelyingPartyStorage.sol")
var AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol")
var AttestationPartyStorage = artifacts.require("./AttestationPartyStorage.sol")

module.exports = function(deployer, network, accounts) {
    var mainAccount = getMainAccount(network);

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

    deployer.deploy(KimlicContextStorage, deployConfig).then((instance)=>{
        kimlicContextStorageInstance = instance;
        return deployer.deploy(KimlicContractsContext, KimlicContextStorage.address, deployConfig);
    }).then((instance)=>{
        kimlicContractsContextInstance = instance;
        return deployer.deploy(AccountStorage, KimlicContextStorage.address, deployConfig);
    })
    .then(()=>{
        return deployer.deploy(AccountStorageAdapter, KimlicContextStorage.address, deployConfig);
    })
    .then(()=>{
        return deployer.deploy(RelyingPartyStorageAdapter, KimlicContextStorage.address, deployConfig);
    })
    .then(()=>{
        return deployer.deploy(RelyingPartyStorage, KimlicContextStorage.address, deployConfig);
    })
    .then(()=>{
        return deployer.deploy(AttestationPartyStorageAdapter, KimlicContextStorage.address, deployConfig);
    })
    .then(()=>{
        return deployer.deploy(AttestationPartyStorage, KimlicContextStorage.address, deployConfig);
    })
    .then(()=>{
        
        return deployer.deploy(VerificationContractFactory, KimlicContextStorage.address, deployConfig);
    })
    .then(()=>{
        return deployer.deploy(ProvisioningContractFactory, KimlicContextStorage.address, deployConfig);
    })
    .then((instance)=>{
        provisioningContractFactoryInstance = instance;
        return deployer.deploy(KimlicToken, deployConfig);
    })
    .then(()=>{
        return deployer.deploy(ProvisioningPrice, deployConfig);
    })
    .then((instance)=>{
        provisioningPriceInstance = instance;
        return deployer.deploy(RewardingContract, KimlicContextStorage.address, deployConfig);
    })
    .then((instance)=>{
        rewardingContractInstance = instance;

        return setupKimlicContextStorageInstance();
    })
    .then(()=>{
        setupKimlicContractsContextInstance();
        setupProvisioningContractFactoryInstance();
        setupRewardingContractInstance();
        setupProvisioningPriceInstance();
    });

    var setupKimlicContextStorageInstance = function() {

        console.log(getFormatedConsoleLable("Setup kimlic context storage instance:"));
        console.log("Context = " + kimlicContractsContextInstance.address);
        return kimlicContextStorageInstance.setContext(kimlicContractsContextInstance.address, deployConfig);
    }
    
    var setupKimlicContractsContextInstance = function() {
        var communityTokenWalletAddress = "0x56e19818ba7e4c0335a4cbf82ee6530c89a30735";//replace this address by your!
        
        console.log(getFormatedConsoleLable("Setup kimlic contracts context instance:"));
        
        console.log("\nAccountStorageAddress = ", AccountStorage.address);
        kimlicContractsContextInstance.setAccountStorage(AccountStorage.address, deployConfig);
        
        console.log("\nAccountStorageAdapter = ", AccountStorageAdapter.address);
        kimlicContractsContextInstance.setAccountStorageAdapter(AccountStorageAdapter.address, deployConfig);
        
        console.log("\nRelyingPartyStorageAdapter = ", RelyingPartyStorageAdapter.address);
        kimlicContractsContextInstance.setAccountStorageAdapter(RelyingPartyStorageAdapter.address, deployConfig);
        
        console.log("\nRelyingPartyStorage = ", RelyingPartyStorage.address);
        kimlicContractsContextInstance.setAccountStorageAdapter(RelyingPartyStorage.address, deployConfig);
        
        console.log("\nAttestationPartyStorageAdapter = ", AttestationPartyStorageAdapter.address);
        kimlicContractsContextInstance.setAccountStorageAdapter(AttestationPartyStorageAdapter.address, deployConfig);
        
        console.log("\nAttestationPartyStorage = ", AttestationPartyStorage.address);
        kimlicContractsContextInstance.setAccountStorageAdapter(AttestationPartyStorage.address, deployConfig);
        
        console.log("\nKimlicToken = ", KimlicToken.address);
        kimlicContractsContextInstance.setKimlicToken(KimlicToken.address, deployConfig);
        
        console.log("\nVerificationContractFactory = ", VerificationContractFactory.address);
        kimlicContractsContextInstance.setVerificationContractFactory(VerificationContractFactory.address, deployConfig);
        
        console.log("\nProvisioningPrice = ", ProvisioningPrice.address);
        kimlicContractsContextInstance.setProvisioningPrice(ProvisioningPrice.address, deployConfig);
        
        console.log("\nProvisioningContractFactory = ", ProvisioningContractFactory.address);
        kimlicContractsContextInstance.setProvisioningContractFactory(ProvisioningContractFactory.address, deployConfig);
        
        console.log("\nCommunity token wallet address = ", communityTokenWalletAddress);
        kimlicContractsContextInstance.setCommunityTokenWalletAddress(communityTokenWalletAddress, deployConfig);
        
        console.log("\nRewardingContract = ", RewardingContract.address);
        kimlicContractsContextInstance.setRewardingContract(RewardingContract.address, deployConfig);
    };
    
    var setupProvisioningContractFactoryInstance = function() {
        
        var interests = {
            communityTokenWallet: 25,
            coOwner: 25,
            attestationParty: 25,
            account: 25,
        };
        console.log(getFormatedConsoleLable("Setup provisioning contract factory instance:"));
        
        console.log(JSON.stringify(interests, null, 4));
        provisioningContractFactoryInstance.setInterestsPercent(interests.communityTokenWallet,
            interests.coOwner, interests.attestationParty, interests.account, deployConfig);
    };
    
    var setupRewardingContractInstance = function() {
        var rewards = {
            mielstone1: 15,
            mielstone2: 25
        };
        console.log(getFormatedConsoleLable("Setup rewarding contract instance:"));
        console.log("set milestone 1 reward = " + rewards.mielstone1);
        rewardingContractInstance.setMilestone1Reward(rewards.mielstone1, deployConfig);
        
        console.log("set milestone 2 reward = " + rewards.mielstone2);
        rewardingContractInstance.setMilestone2Reward(rewards.mielstone2, deployConfig);
    };
    
    var setupProvisioningPriceInstance = function() {
        
        console.log(getFormatedConsoleLable("setupProvisioningPriceInstance"));
        var prices = {
            email: 10,
            phone: 15,
            identity: 12,
            documents: 22,
            addresses: 16
        }
        
        console.log("Email = " + prices.email);
        provisioningPriceInstance.setPrice(0, prices.email, deployConfig);
        
        console.log("Phone = " + prices.phone);
        provisioningPriceInstance.setPrice(1, prices.phone, deployConfig);
        
        console.log("Identity = " + prices.identity);
        provisioningPriceInstance.setPrice(2, prices.identity, deployConfig);
        
        console.log("Documents = " + prices.documents);
        provisioningPriceInstance.setPrice(4, prices.documents, deployConfig);
        
        console.log("Addresses = " + prices.addresses);
        provisioningPriceInstance.setPrice(5, prices.addresses, deployConfig);
    };
    
    var getFormatedConsoleLable = function(unformatedLable){
        var separationString = "=".repeat(10);
        return "\n" + separationString + " " + unformatedLable + " " + separationString + "\n";
    };
};
