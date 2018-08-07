let fs = require("fs");

const fileName = "deployedConfig.json";
let deployedConfig = {};
let isConfigLoaded = false;


const cleanupDeployedConfig = function(network) {
    if (!isConfigLoaded) {
        loadDeployedConfigIntoCache();
    }
    deployedConfig[network] = {};
}

const getNetworkDeployedConfig = (network) => {
    if (!isConfigLoaded) {
        loadDeployedConfigIntoCache();
    }

    if (!deployedConfig[network]) {
        deployedConfig[network] = {};
    }
    return deployedConfig[network];
};

const loadDeployedConfigIntoCache = () => {
    if (fs.existsSync(fileName)) {
        deployedConfig = JSON.parse(fs.readFileSync(fileName)) || {};
    }
    isConfigLoaded = true;
};

const saveDeployedConfig = () => {
    if(!isConfigLoaded) {
        throw "Config not loaded! Use loadDeployedConfigIntoCache method first."
    }
    fs.writeFileSync(fileName, JSON.stringify(deployedConfig, null, 4));
};


const deployedConfigPathConsts = {//TODO move to config file?
    deployedContracts: {
        kimlicContextStorageAddress: {
            path: "deployedContracts.kimlicContextStorageAddress"
        },
        kimlicContractsContextAddress: {
            path: "deployedContracts.kimlicContractsContextAddress"
        },
        accountStorageAddress: {
            path: "deployedContracts.accountStorageAddress"
        },
        accountStorageAdapterAddress: {
            path: "deployedContracts.accountStorageAdapterAddress"
        },
        relyingPartyStorageAdapterAddress: {
            path: "deployedContracts.relyingPartyStorageAdapterAddress"
        },
        relyingPartyStorageAddress: {
            path: "deployedContracts.relyingPartyStorageAddress"
        },
        attestationPartyStorageAdapterAddress: {
            path: "deployedContracts.attestationPartyStorageAdapterAddress"
        },
        attestationPartyStorageAddress: {
            path: "deployedContracts.attestationPartyStorageAddress"
        },
        verificationContractFactoryAddress: {
            path: "deployedContracts.verificationContractFactoryAddress"
        },
        provisioningContractFactoryAddress: {
            path: "deployedContracts.provisioningContractFactoryAddress"
        },
        kimlicTokenAddress: {
            path: "deployedContracts.kimlicTokenAddress"
        },
        rewardingContractAddress: {
            path: "deployedContracts.rewardingContractAddress"
        },
        path: "deployedContracts"
    },
    accountStorageAdapter: {
        allowedFieldNames: {
            path: "accountStorageAdapter.allowedFieldNames"
        },
        owner: {
            path: "accountStorageAdapter.owner"
        },
        path: "accountStorageAdapter"
    },
    provisioningContractFactory: {
        accountField: {
            intersets: {
                pathTemplate: "provisioningContractFactory.{accountField}.intersets"
            },
            tokensLockPeriod: {
                pathTemplate: "provisioningContractFactory.{accountField}.tokensLockPeriod"
            },
            pathTemplate: "provisioningContractFactory.{accountField}"
        },
        path: "provisioningContractFactory"
    },
    verificationContractFactory: {
        accountField: {
            tokensLockPeriod: {
                pathTemplate: "verificationContractFactory.{accountField}.tokensLockPeriod"
            },
            pathTemplate: "verificationContractFactory.{accountField}"
        },
        path: "verificationContractFactory"
    },
    rewardingContractConfig: {
        rewards: {
            path: "rewardingContractConfig.rewards"
        },
        milestone2fieldNames: {
            path: "rewardingContractConfig.milestone2fieldNames"
        },
        path: "rewardingContractConfig"
    },
    communityTokenWallet: {
        path: "communityTokenWallet"
    },
    partiesConfig: {
        createdParties: {
            path: "partiesConfig.createdParties",
            party: {
                pathTemplate: "partiesConfig.createdParties.{partyName}",
                address: {
                    pathTemplate: "partiesConfig.createdParties.{partyName}.address"
                },
                password: {
                    pathTemplate: "partiesConfig.createdParties.{partyName}.password"
                },
                allowedFieldNames: {
                    pathTemplate: "partiesConfig.createdParties.{partyName}.allowedFieldNames"
                }
            },
        },
        path: "partiesConfig"
    },
    createdUsers: {
        path: "createdUsers"
    },
    kimlicWallet: {
        path: "kimlicWallet"
    },
    pricelistConfig: {
        pathTemplate: "{pricelistName}Config",
        prices: {
            pathTemplate: "{pricelistName}Config.prices",
        }
    },
    deployerAddress: {
        path: "deployerAddress"
    }
};

module.exports = { saveDeployedConfig, loadDeployedConfigIntoCache, getNetworkDeployedConfig, cleanupDeployedConfig, deployedConfigPathConsts };