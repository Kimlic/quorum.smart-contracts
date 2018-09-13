const KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");
const { getNetworkDeployedConfig, deployedConfigPathConsts, saveDeployedConfig } = require("../deployedConfigHelper");
const { setValueByPath, getFormatedConsoleLabel } = require("../commonLogic/commonLogic");

// Parameters

const kimlicWalletPassword = "kimlicWalletp@ssw0rd"

/**
 * Kimlic wallet creation
 */
module.exports = async function (deployer) {
  console.log(getFormatedConsoleLabel("Create kimlic wallet address"));
  deployer.then(async () => {
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);
    let address = web3.personal.newAccount(kimlicWalletPassword);
    console.log(`kimlic wallet address: ${address}`);

    const kimlicContractsContext = await KimlicContractsContext.deployed();
    await kimlicContractsContext.setKimlicWalletAddress(address);

    const kimlicWalletConfig = { address: address, password: kimlicWalletPassword };
    const kimlicWalletConfigPath = deployedConfigPathConsts.kimlicWallet.path;
    setValueByPath(deployedConfig, kimlicWalletConfigPath, kimlicWalletConfig);
    
    saveDeployedConfig();
  });
}