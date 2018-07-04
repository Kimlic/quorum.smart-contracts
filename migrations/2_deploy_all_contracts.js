/*jshint esversion: 6 */
let { getDeployConfig } = require("./Helpers/MigrationHelper");
let fs = require("fs");

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

module.exports = function(deployer, network, accounts) {
    let deployConfig = getDeployConfig(deployer, network, accounts);

    let createdUsersFileName = "CreatedUsers.json";

    if(fs.existsSync(createdUsersFileName)) {
        fs.unlink(createdUsersFileName);//clear list of created users on redeploy
    }

    deployer.then(async () => {
        await deployer.deploy(KimlicContextStorage, deployConfig);

        await deployer.deploy(KimlicContractsContext, KimlicContextStorage.address, deployConfig);

        await deployer.deploy(AccountStorage, KimlicContextStorage.address, deployConfig);

        await deployer.deploy(AccountStorageAdapter, KimlicContextStorage.address, deployConfig);

        await deployer.deploy(RelyingPartyStorageAdapter, KimlicContextStorage.address, deployConfig);

        await deployer.deploy(RelyingPartyStorage, KimlicContextStorage.address, deployConfig);

        await deployer.deploy(AttestationPartyStorageAdapter, KimlicContextStorage.address, deployConfig);

        await deployer.deploy(AttestationPartyStorage, KimlicContextStorage.address, deployConfig);

        await deployer.deploy(VerificationContractFactory, KimlicContextStorage.address, deployConfig);

        await deployer.deploy(ProvisioningContractFactory, KimlicContextStorage.address, deployConfig);

        await deployer.deploy(KimlicToken, deployConfig);

        await deployer.deploy(RewardingContract, KimlicContextStorage.address, deployConfig);
    });
};
