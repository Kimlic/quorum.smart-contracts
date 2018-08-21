
const KimlicToken = artifacts.require("./KimlicToken.sol");
const AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");

const { getNetworkDeployedConfig, deployedConfigPathConsts, saveDeployedConfig } = require("../deployedConfigHelper");
const { sendEthToAccount } = require("../commonLogic/commonEthereumLogic");
const { setValueByPath, getValueByPath, combinePath } = require("../commonLogic/commonLogic");

/**
 * Script to be run by Kimlic team to perform AP registration procedure
 */
module.exports = async function(callback) {//Temp script for manual add AP/RP
    const partyName = "test";
    const address = "0x0bb5812cdabd4d07497d5364005e8149770db1bf";

    const grantAccessToFields = [];
    const removeAccessToFields = [];

    const deployedConfig = getNetworkDeployedConfig(web3.version.network);
    const mainAddressPath = deployedConfigPathConsts.deployerAddress.path;
    const mainAddress = getValueByPath(deployedConfig, mainAddressPath, "0x0");
    console.log(`mainAddress: ${mainAddress}`)

    sendEthToAccount(web3, mainAddress, address);

    console.log(`Send tokens to "${partyName}" account`);

    const tokensToSendAmount = 10000 * Math.pow(10, 18);
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
    
    const allowedFieldNamesConfigPath = deployedConfigPathConsts.partiesConfig.createdParties.party.allowedFieldNames.pathTemplate;
    const allowedFieldNames = getValueByPath(deployedConfig, combinePath(allowedFieldNamesConfigPath, { partyName: partyName }), []);
    
    const adapter = await AttestationPartyStorageAdapter.deployed();
    removeAccessToFields.forEach(async (fieldName) => {
        console.log(`Remove access to verify field ${fieldName} from address ${address}`);
        await adapter.removeAccessToFieldVerification(address, fieldName);
        const allowedFieldIndex = allowedFieldNames.indexOf(fieldName);
        if (allowedFieldIndex >= 0) {
            allowedFieldNames.splice(allowedFieldIndex, 1);
        }
    });
    grantAccessToFields.forEach(async (fieldName) => {
        console.log(`Grant access to verify field ${fieldName} from address ${address}`);
        const allowedFieldIndex = allowedFieldNames.indexOf(fieldName);
        if (allowedFieldIndex < 0) {
            allowedFieldNames.push(fieldName);
            await adapter.addAccessToFieldVerification(address, fieldName);
        }
    });

    console.log("save");
    saveDeployedConfig();

    callback.call();
}