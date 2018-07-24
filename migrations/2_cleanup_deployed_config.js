let { saveDeployedConfig, cleanupDeployedConfig, getNetworkDeployedConfig } = require("../deployedConfigHelper");

module.exports = function(deployer, network) {
    cleanupDeployedConfig();
    let config = getNetworkDeployedConfig(web3.version.network);
    config.networkName = network;
    saveDeployedConfig();
};