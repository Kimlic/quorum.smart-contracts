/*jshint esversion: 6 */

const RewardingContract = artifacts.require("./RewardingContract.sol");

const { getTransactionConfig, getFormatedConsoleLabel } = require("./Helpers/MigrationHelper");
const { loadDeployedConfigIntoCache, saveDeployedConfig, getNetworkDeployedConfig } = require("../deployedConfigHelper");
const { setValueByPath, getValueByPath } = require("../commonLogic");

module.exports = function(deployer, network, accounts) {
    console.log(getFormatedConsoleLabel("Setup rewarding contract instance:"));
    const transactionConfig = getTransactionConfig(deployer, network, accounts);

    deployer.then(async () => {
        loadDeployedConfigIntoCache();
        const deployedConfig = getNetworkDeployedConfig(network);
        const configPath = "rewardingContractConfig.rewards";
        const currentSetup = getValueByPath(deployedConfig, configPath);

        const rewardingContractInstance = await RewardingContract.deployed();

        let rewards = {
            mielstone1: 15,
            mielstone2: 25
        };

        rewards = {...currentSetup, ...rewards};

        console.log(`set milestone 1 reward = ${rewards.mielstone1}`);
        await rewardingContractInstance.setMilestone1Reward(rewards.mielstone1, transactionConfig);
        
        console.log(`set milestone 2 reward = ${rewards.mielstone2}`);
        await rewardingContractInstance.setMilestone2Reward(rewards.mielstone2, transactionConfig);

        setValueByPath(deployedConfig, configPath, rewards);
        saveDeployedConfig();
    });
};
