const KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");

const { getNetworkDeployedConfig, deployedConfigPathConsts, saveDeployedConfig } = require("../deployedConfigHelper");
const { setValueByPath, getFormatedConsoleLabel } = require("../commonLogic");


module.exports = async function(deployer) {
    console.log(getFormatedConsoleLabel("Create kimlic wallet address"));
    deployer.then(async () => {

        const deployedConfig = getNetworkDeployedConfig(web3.version.network);

        let password = "kimlicWalletp@ssw0rd";
        let address = web3.personal.newAccount(password);
        console.log(`kimlic wallet address: ${address}`);

        const kimlicContractsContext = await KimlicContractsContext.deployed();
        await kimlicContractsContext.setKimlicWalletAddress(address);
    
        const kimlicWalletConfig = {address: address, password: password};
        const kimlicWalletConfigPath = deployedConfigPathConsts.kimlicWallet.path;
        setValueByPath(deployedConfig, kimlicWalletConfigPath, kimlicWalletConfig);
        saveDeployedConfig();
    });
}