let fs = require("fs");
let { getValueByPath } = require("./commonLogic");

let getMainAccount = (network) => {
    return getConfigValueByPath(network, "addresses.mainAccount");
};

let getConfigValueByPath = (network, path) => {
    let config = JSON.parse(fs.readFileSync('config.json'));
    let networkConfig = config[network] || {};
    let defaultConfig = config["default"] || {};

    return getValueByPath(networkConfig, path)
        || getValueByPath(defaultConfig, path)
        || {};
};

module.exports = { getMainAccount, getConfigValueByPath };