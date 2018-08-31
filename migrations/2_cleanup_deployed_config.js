const { saveDeployedConfig, cleanupDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");

/**
 * cleanup of previous migration outputs, saving new one with initial seed data
 */
module.exports = function(deployer, network, accounts) {
    cleanupDeployedConfig(web3.version.network);
    let config = getNetworkDeployedConfig(web3.version.network);

    config[deployedConfigPathConsts.deployerAddress.path] = web3.eth.coinbase
    config.networkName = network;
    saveDeployedConfig();
};