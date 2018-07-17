/*jshint esversion: 6 */
let ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");

let { getDeployConfig, getFormatedConsoleLable } = require("./Helpers/MigrationHelper");

module.exports = function(deployer, network, accounts) {
    console.log(getFormatedConsoleLable("Setup provisioning contract factory instance:"));

    let deployConfig = getDeployConfig(deployer, network, accounts);

    deployer.then(async () => {
        let provisioningContractFactoryInstance = await ProvisioningContractFactory.deployed();
        let interests = {
            communityTokenWallet: 25,
            coOwner: 25,
            attestationParty: 25,
            account: 25,
        };
        
        console.log(JSON.stringify(interests, null, 4));
        await provisioningContractFactoryInstance.setInterestsPercent(interests.communityTokenWallet,
            interests.coOwner, interests.attestationParty, interests.account, deployConfig);
    });
};
