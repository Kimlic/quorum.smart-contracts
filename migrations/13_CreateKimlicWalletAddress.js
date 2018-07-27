const KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");

const { loadDeployedConfigIntoCache, getNetworkDeployedConfig, deployedConfigPathConsts, saveDeployedConfig } = require("../deployedConfigHelper");
const { setValueByPath, getFormatedConsoleLabel } = require("../commonLogic");


var fs = require("fs");

module.exports = async function(deployer) {
    console.log(getFormatedConsoleLabel("Create kimlic wallet address"));
    deployer.then(() => {
        loadDeployedConfigIntoCache();

        const deployedConfig = getNetworkDeployedConfig(web3.version.network);

        let password = "kimlicWalletp@ssw0rd";
        let address = web3.personal.newAccount(password);
        console.log(`kimlic wallet address: ${address}`);
    
        KimlicContractsContext
    
        const kimlicWalletConfig = {address: address, password: password};
        const kimlicWalletConfigPath = deployedConfigPathConsts.kimlicWallet.path;
        setValueByPath(deployedConfig, kimlicWalletConfigPath, kimlicWalletConfig);
        saveDeployedConfig();
    });
}