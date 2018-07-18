let fs = require("fs");

const fileName = "deployedConfig.json";
var deployedConfig = {};
var isConfigLoaded = false;

let cleanupDeployedConfig = function(network) {
    deployedConfig[network] = {};
}

let getNetworkDeployedConfig = (network) => {
    if (!deployedConfig[network]) {
        deployedConfig[network] = {};
    }
    return deployedConfig[network];
};

let loadDeployedConfigIntoCache = (network) => {
    if (fs.existsSync(fileName)) {
        deployedConfig = JSON.parse(fs.readFileSync(fileName));
    }
    isConfigLoaded = true;
};

let saveDeployedConfig = () => {
    if(!isConfigLoaded) {
        throw "Config not loaded! Use loadDeployedConfigIntoCache method first."
    }
    fs.writeFileSync(fileName, JSON.stringify(deployedConfig, null, 4));
};


module.exports = { saveDeployedConfig, loadDeployedConfigIntoCache, getNetworkDeployedConfig, cleanupDeployedConfig };