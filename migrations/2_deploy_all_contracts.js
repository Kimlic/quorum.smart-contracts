/*jshint esversion: 6 */
let AccountStorage = artifacts.require("./AccountStorage.sol");
let KimlicContextStorage = artifacts.require("./KimlicContextStorage.sol");
let KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");
let AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
let VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
let ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
let KimlicToken = artifacts.require("./KimlicToken.sol");
let RewardingContract = artifacts.require("./RewardingContract.sol");
let RelyingPartyStorageAdapter = artifacts.require("./RelyingPartyStorageAdapter.sol");
let RelyingPartyStorage = artifacts.require("./RelyingPartyStorage.sol");
let AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");
let AttestationPartyStorage = artifacts.require("./AttestationPartyStorage.sol");

let { getDeployConfig, getFormatedConsoleLable } = require("./Helpers/MigrationHelper");
let fs = require("fs");

module.exports = function(deployer, network, accounts) {
    console.log(getFormatedConsoleLable("deploy all contracts: "));
    let deployConfig = getDeployConfig(deployer, network, accounts);

    let createdUsersFileName = "CreatedUsers.json";

    if(fs.existsSync(createdUsersFileName)) {
        fs.unlink(createdUsersFileName);//clear list of created users on redeploy
    }

    deployer.then(async () => {
        await deployer.deploy(KimlicContextStorage, deployConfig);
        console.log(`KimlicContextStorage deployed at address ${KimlicContextStorage.address}`);

        await deployer.deploy(KimlicContractsContext, KimlicContextStorage.address, deployConfig);
        console.log(`KimlicContractsContext deployed at address ${KimlicContractsContext.address}`);

        await deployer.deploy(AccountStorage, KimlicContextStorage.address, deployConfig);
        console.log(`AccountStorage deployed at address ${AccountStorage.address}`);

        await deployer.deploy(AccountStorageAdapter, KimlicContextStorage.address, deployConfig);
        console.log(`AccountStorageAdapter deployed at address ${AccountStorageAdapter.address}`);

        await deployer.deploy(RelyingPartyStorageAdapter, KimlicContextStorage.address, deployConfig);
        console.log(`RelyingPartyStorageAdapter deployed at address ${RelyingPartyStorageAdapter.address}`);

        await deployer.deploy(RelyingPartyStorage, KimlicContextStorage.address, deployConfig);
        console.log(`RelyingPartyStorage deployed at address ${RelyingPartyStorage.address}`);

        await deployer.deploy(AttestationPartyStorageAdapter, KimlicContextStorage.address, deployConfig);
        console.log(`AttestationPartyStorageAdapter deployed at address ${AttestationPartyStorageAdapter.address}`);

        await deployer.deploy(AttestationPartyStorage, KimlicContextStorage.address, deployConfig);
        console.log(`AttestationPartyStorage deployed at address ${AttestationPartyStorage.address}`);

        await deployer.deploy(VerificationContractFactory, KimlicContextStorage.address, deployConfig);
        console.log(`VerificationContractFactory deployed at address ${VerificationContractFactory.address}`);

        await deployer.deploy(ProvisioningContractFactory, KimlicContextStorage.address, deployConfig);
        console.log(`ProvisioningContractFactory deployed at address ${ProvisioningContractFactory.address}`);

        await deployer.deploy(KimlicToken, deployConfig);
        console.log(`KimlicToken deployed at address ${KimlicToken.address}`);

        await deployer.deploy(RewardingContract, KimlicContextStorage.address, deployConfig);
        console.log(`RewardingContract deployed at address ${RewardingContract.address}`);
    });
};
