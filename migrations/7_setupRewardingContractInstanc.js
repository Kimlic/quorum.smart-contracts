/*jshint esversion: 6 */

let RewardingContract = artifacts.require("./RewardingContract.sol");

let { getDeployConfig, getFormatedConsoleLable } = require("./Helpers/MigrationHelper");

module.exports = function(deployer, network, accounts) {
    console.log(getFormatedConsoleLable("Setup rewarding contract instance:"));
    let deployConfig = getDeployConfig(deployer, network, accounts);

    deployer.then(async () => {
        let rewardingContractInstance = await RewardingContract.deployed();

        let rewards = {
            mielstone1: 15,
            mielstone2: 25
        };
        console.log(`set milestone 1 reward = ${rewards.mielstone1}`);
        await rewardingContractInstance.setMilestone1Reward(rewards.mielstone1, deployConfig);
        
        console.log(`set milestone 2 reward = ${rewards.mielstone2}`);
        await rewardingContractInstance.setMilestone2Reward(rewards.mielstone2, deployConfig);
    });
};
