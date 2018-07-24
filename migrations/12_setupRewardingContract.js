/*jshint esversion: 6 */

const KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");
const KimlicContextStorage = artifacts.require("./KimlicContextStorage.sol");
const RewardingContract = artifacts.require("./RewardingContract.sol");

const { getFormatedConsoleLabel } = require("./Helpers/MigrationHelper");
const { saveDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { getValueByPath, setValueByPath } = require("../commonLogic");


module.exports = function(deployer) {
    console.log(getFormatedConsoleLabel(`Setup rewarding contracts`));

    deployer.then(async () => {
        const kimlicContextStorageInstance = await KimlicContextStorage.deployed(); 

        const contextAddress = await kimlicContextStorageInstance.getContext.call();
        const context = await KimlicContractsContext.at(contextAddress);

        const rewardingContractAddress = await context.getRewardingContract.call();
        const rewardingContract = await RewardingContract.at(rewardingContractAddress);
        const config = getNetworkDeployedConfig(web3.version.network);

        const rewards = {
            mielstone1Reward: 10,
            mielstone2Reward: 15
        }

        await rewardingContract.setMilestone1Reward(rewards.mielstone1Reward);
        await rewardingContract.setMilestone2Reward(rewards.mielstone2Reward);
        console.log(`rewards: ${JSON.stringify(rewards)}`);

        setValueByPath(config, deployedConfigPathConsts.rewardingContractConfig.rewards.path, rewards);

        const allowedFieldNames = getValueByPath(config, deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path, []);
        const mielstone2FieldNames = allowedFieldNames.filter((str)=>str.startsWith("documents"));
        mielstone2FieldNames.forEach(async fieldName => {
            await rewardingContract.addMielstone2FieldName(fieldName);
        });

        console.log(`mielstone2Fields: ${JSON.stringify(mielstone2FieldNames)}`);
        setValueByPath(config, deployedConfigPathConsts.rewardingContractConfig.mielstone2fieldNames.path, mielstone2FieldNames);

        saveDeployedConfig();
    });
};
