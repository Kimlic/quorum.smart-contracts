/*jshint esversion: 6 */
let KimlicToken = artifacts.require("./KimlicToken.sol");
let RewardingContract = artifacts.require("./RewardingContract.sol");

let { getFormatedConsoleLable } = require("./Helpers/MigrationHelper");

module.exports = function(deployer, network, accounts) {
    let communityTokenWalletAddress = accounts[0];//TODO move to config

    deployer.then(async () => {
        let kimlicTokenInstance = await KimlicToken.deployed();

        console.log(getFormatedConsoleLable("setup community token wallet address"));
        console.log("Approve rewarding contract to spend tokens from community token wallet");
        await kimlicTokenInstance.approve(RewardingContract.address, 1000000000, { form: communityTokenWalletAddress });//TODO unlock address
    });
};
