/*jshint esversion: 6 */
const KimlicToken = artifacts.require("./KimlicToken.sol");
const RewardingContract = artifacts.require("./RewardingContract.sol");

const { getFormatedConsoleLabel, getValueByPath } = require("../commonLogic/commonLogic");
const { getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");

// Parameters

const approveAmount = 1000000000
const transferAmount = 10000000

/**
 * CommunityTokenWallet initial setup - permissions for RewardingContract, initial balance allocation
 */
module.exports = function (deployer) {
  console.log(getFormatedConsoleLabel("setup community token wallet address"));

  deployer.then(async () => {
    let kimlicTokenInstance = await KimlicToken.deployed();
    console.log("Approve rewarding contract to spend tokens from community token wallet");

    const deployedConfig = getNetworkDeployedConfig(web3.version.network);
    const configPath = deployedConfigPathConsts.communityTokenWallet.path;
    const communityTokenWallet = getValueByPath(deployedConfig, configPath);
    console.log(`communityTokenWallet: ${JSON.stringify(communityTokenWallet)}`);

    web3.personal.unlockAccount(communityTokenWallet.address, communityTokenWallet.password, 100);

    await kimlicTokenInstance.approve(RewardingContract.address, approveAmount * Math.pow(10, 18), { from: communityTokenWallet.address }); //10^18 its token decimals
    kimlicTokenInstance.transfer(communityTokenWallet.address, transferAmount * Math.pow(10, 18)); //10^18 its token decimals

    console.log(`allowance to spend communityTokenWallet tokens from RewardingContract: ${
      await kimlicTokenInstance.allowance.call(communityTokenWallet.address, RewardingContract.address) / Math.pow(10, 18)}`);
  });
};
