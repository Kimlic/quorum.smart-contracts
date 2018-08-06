const { saveDeployedConfig, cleanupDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const truffleConfig = require("../truffle");

module.exports = function(deployer, network, accounts) {
    cleanupDeployedConfig();
    let config = getNetworkDeployedConfig(web3.version.network);
    
    config[deployedConfigPathConsts.deployerAddress.path] = truffleConfig.networks[network].from || accounts[0];
    config.networkName = network;
    saveDeployedConfig();
};