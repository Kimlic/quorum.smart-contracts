/*jshint esversion: 6 */
const KimlicToken = artifacts.require("./KimlicToken.sol");
const RewardingContract = artifacts.require("./RewardingContract.sol");

const { getFormatedConsoleLabel } = require("./Helpers/MigrationHelper");
const { getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { getValueByPath } = require("../commonLogic");

module.exports = function(deployer) {
    console.log(getFormatedConsoleLabel("setup community token wallet address"));

    deployer.then(async () => {
        let kimlicTokenInstance = await KimlicToken.deployed();

        console.log("Approve rewarding contract to spend tokens from community token wallet");
        
        
        const deployedConfig = getNetworkDeployedConfig(web3.version.network);
        const configPath = deployedConfigPathConsts.communityTokenWallet.path;
        const communityTokenWallet = getValueByPath(deployedConfig, configPath);
        console.log(`communityTokenWallet: ${JSON.stringify(communityTokenWallet)}`);
        
        web3.personal.unlockAccount(communityTokenWallet.address, communityTokenWallet.password, 100);

        await kimlicTokenInstance.approve(RewardingContract.address, 1000000000, { from: communityTokenWallet.address });

        kimlicTokenInstance.transfer(communityTokenWallet.address, 10000000);

        console.log(`allowance to spend communityTokenWallet tokens from RewardingContract: ${ 
            await kimlicTokenInstance.allowance.call(communityTokenWallet.address, RewardingContract.address)}`);
    });
};
