
const KimlicToken = artifacts.require("./KimlicToken.sol");

const { getNetworkDeployedConfig, deployedConfigPathConsts, saveDeployedConfig } = require("../deployedConfigHelper");
const { sendEthToAccount } = require("../commonLogic/commonEthereumLogic");
const { setValueByPath, getValueByPath, combinePath } = require("../commonLogic/commonLogic");

/**
 * Script to be run by Kimlic team to perform RP registration procedure
 */
module.exports = async function(callback) {//Temp script for manual add AP/RP
    const partyName = "rp_kimlic";
    const address = "0x5cdb00a372845c3146a19439f684094f1daa09d6";
    const tokensToSendAmount = 10000 * Math.pow(10, 18);

    const deployedConfig = getNetworkDeployedConfig(web3.version.network);
    const mainAddressPath = deployedConfigPathConsts.deployerAddress.path;
    const mainAddress = getValueByPath(deployedConfig, mainAddressPath, "0x0");
    console.log(`mainAddress: ${mainAddress}`)

    sendEthToAccount(web3, mainAddress, address);

    console.log(`Send tokens to "${partyName}" account`);

    const kimlicTokenInstancePath = deployedConfigPathConsts.deployedContracts.kimlicTokenAddress.path;
    const kimlicTokenInstanceAddress = getValueByPath(deployedConfig, kimlicTokenInstancePath, "0x0");
    console.log(`kimlicTokenInstanceAddress: ${kimlicTokenInstanceAddress}`)
    const kimlicTokenInstance = await KimlicToken.at(kimlicTokenInstanceAddress);


    console.log(`send tokens to account "${tokensToSendAmount / Math.pow(10, 18)}"`);//10^18 its token decimals
    console.log(`main acc balance: ${await kimlicTokenInstance.balanceOf(mainAddress)}`);
    await kimlicTokenInstance.transfer(address, tokensToSendAmount, { from: mainAddress });

    console.log(`balance: ${await kimlicTokenInstance.balanceOf(address)}`);
        
    const partyConfigPath = deployedConfigPathConsts.partiesConfig.createdParties.party.address.pathTemplate;
    setValueByPath(deployedConfig, combinePath(partyConfigPath, { partyName: partyName }));
    
    console.log("save");
    saveDeployedConfig();

    callback.call();
}