let { loadDeployedConfigIntoCache, saveDeployedConfig, cleanupDeployedConfig } = require("../deployedConfigHelper")

module.exports = function(deployer, network) {
    loadDeployedConfigIntoCache();
    cleanupDeployedConfig(network);
    saveDeployedConfig();
};