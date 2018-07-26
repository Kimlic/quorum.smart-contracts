const fs = require("fs");
const { getValueByPath } = require("./commonLogic");

const fileName = "config.json";

const getMainAccount = (network) => {
    return getConfigValueByPath(network, configPathConsts.addresses.mainAccount.path);
};

const getConfigValueByPath = (network, path, defaultValue = {}) => {
    const config = JSON.parse(fs.readFileSync(fileName));
    const networkConfig = config[network] || {};
    const defaultConfig = config["default"] || {};

    return getValueByPath(networkConfig, path, null)
        || getValueByPath(defaultConfig, path, null)
        || defaultValue;
};

const configPathConsts = {
    addresses: {
        path: "addresses",
        mainAccount: {
            path: "addresses.mainAccount",
            partialPath: "mainAccount"
        }
    },
    parties: {
        path: "parties",
        name: {
            partialPath: "name",
            path: "parties.name"
        },
        tokensBalance: {
            partialPath: "tokensBalance",
            path: "parties.tokensBalance"
        },
        allowedFieldNames: {
            partialPath: "allowedFieldNames",
            path: "parties.allowedFieldNames"
        }
    }
}


module.exports = { getMainAccount, getConfigValueByPath, configPathConsts };