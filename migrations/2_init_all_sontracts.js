var BaseStorage = artifacts.require("./BaseStorage.sol");
var KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");
var AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
var VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
var ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
var KimlicToken = artifacts.require("./KimlicToken.sol");
var ProvisioningPrice = artifacts.require("./ProvisioningPrice.sol");
var RewardingContract = artifacts.require("./RewardingContract.sol");

module.exports = function(deployer) {
	var kimlicContractsContextInstance;
	var provisioningContractFactoryInstance;
	var rewardingContractInstance;
	var provisioningPriceInstance;
		
	deployer.deploy(KimlicContractsContext).then((instance)=>{
		kimlicContractsContextInstance = instance;
		return deployer.deploy(BaseStorage, KimlicContractsContext.address);
	})
	.then(()=>{
		return deployer.deploy(AccountStorageAdapter, KimlicContractsContext.address);
	})
	.then(()=>{
		
		return deployer.deploy(VerificationContractFactory, KimlicContractsContext.address);
	})
	.then(()=>{
		return deployer.deploy(ProvisioningContractFactory, KimlicContractsContext.address);
	})
	.then((instance)=>{
		provisioningContractFactoryInstance = instance;
		return deployer.deploy(KimlicToken);
	})
	.then(()=>{
		return deployer.deploy(ProvisioningPrice);
	})
	.then((instance)=>{
		provisioningPriceInstance = instance;
		return deployer.deploy(RewardingContract, KimlicContractsContext.address);
	})
	.then((instance)=>{
		rewardingContractInstance = instance;
		
		setupKimlicContractsContextInstance();
		setupProvisioningContractFactoryInstance();
		setupRewardingContractInstance();
		setupProvisioningPriceInstance();
	});
	
	var setupKimlicContractsContextInstance = function() {
		var communityTokenWalletAddress = "0x56e19818ba7e4c0335a4cbf82ee6530c89a30735";//replace this address by your!
		
		console.log(getFormatedConsoleLable("Setup kimlic contracts context instance:"));
		
		console.log("AccountStorageAddress = ", BaseStorage.address);
		kimlicContractsContextInstance.setAccountStorage(BaseStorage.address);
		
		console.log("AccountStorageAdapter = ", AccountStorageAdapter.address);
		kimlicContractsContextInstance.setAccountStorageAdapter(AccountStorageAdapter.address);
		
		console.log("KimlicToken = ", KimlicToken.address);
		kimlicContractsContextInstance.setKimlicToken(KimlicToken.address);
		
		console.log("VerificationContractFactory = ", VerificationContractFactory.address);
		kimlicContractsContextInstance.setVerificationContractFactory(VerificationContractFactory.address);
		
		console.log("VerificationContractFactory = ", VerificationContractFactory.address);
		kimlicContractsContextInstance.setProvisioningPrice(ProvisioningPrice.address);
		
		console.log("ProvisioningContractFactory = ", ProvisioningContractFactory.address);
		kimlicContractsContextInstance.setProvisioningContractFactory(ProvisioningContractFactory.address);
		
		console.log("communityTokenWalletAddress = ", communityTokenWalletAddress);
		kimlicContractsContextInstance.setCommunityTokenWalletAddress(communityTokenWalletAddress);
		
		console.log("RewardingContract = ", RewardingContract.address);
		kimlicContractsContextInstance.setRewardingContract(RewardingContract.address);
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
			interests.coOwner, interests.attestationParty, interests.account);
	};
	
	var setupRewardingContractInstance = function() {
		var rewards = {
			mielstone1: 15,
			mielstone2: 25
		};
		console.log(getFormatedConsoleLable("Setup rewarding contract instance:"));
		console.log("set milestone 1 reward = " + rewards.mielstone1);
		rewardingContractInstance.setMilestone1Reward(rewards.mielstone1);
		
		console.log("set milestone 2 reward = " + rewards.mielstone2);
		rewardingContractInstance.setMilestone2Reward(rewards.mielstone2);
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
		provisioningPriceInstance.setPrice(0, prices.email);
		
		console.log("Phone = " + prices.phone);
		provisioningPriceInstance.setPrice(1, prices.phone);
		
		console.log("Identity = " + prices.identity);
		provisioningPriceInstance.setPrice(2, prices.identity);
		
		console.log("Documents = " + prices.documents);
		provisioningPriceInstance.setPrice(4, prices.documents);
		
		console.log("Addresses = " + prices.addresses);
		provisioningPriceInstance.setPrice(5, prices.addresses);
	};
	
	var getFormatedConsoleLable = function(unformatedLable){
		var separationString = "=".repeat(10);
		return "\n" + separationString + " " + unformatedLable + " " + separationString + "\n";
	};
};
