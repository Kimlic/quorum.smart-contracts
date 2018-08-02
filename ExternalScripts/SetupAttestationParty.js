
const KimlicToken = artifacts.require("./KimlicToken.sol");
const VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
const ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
const AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");

const { getNetworkDeployedConfig, deployedConfigPathConsts, saveDeployedConfig } = require("../deployedConfigHelper");
const { sendEthToAccount } = require("../commonLogic/commonEthereumLogic");
const { setValueByPath, getValueByPath, combinePath } = require("../commonLogic/commonLogic");


module.exports = async function(callback) {//Temp script for manual add AP/RP
    const partyName = "partyName";
    const address = "0x5d053743a16fbd88df98969c7e125999832adc8e";
    const grantAccessToFields = [
        "email",
        "phone",
        "documents.id_card",
        "documents.passport",
        "documents.driver_license",
        "documents.residence_permit_card",
        "addresses.billing",
        "addresses.living"
    ];
    const removeAccessToFields = [];

    const deployedConfig = getNetworkDeployedConfig(web3.version.network);

    sendEthToAccount(web3, deployedConfig.deployerAddress, address);

    console.log(`Send tokens to "${partyName}" account`);

    const tokensToSendAmount = 10000 * Math.pow(10, 18);
    const kimlicTokenInstance = await KimlicToken.deployed();

    console.log(`send tokens to account "${tokensToSendAmount / Math.pow(10, 18)}"`);//10^18 its token decimals
    await kimlicTokenInstance.transfer(address, tokensToSendAmount);
    
    console.log(`Approve to verificationContractFactory spend "${partyName}" tokens`);
    await kimlicTokenInstance.approve(VerificationContractFactory.address, tokensToSendAmount, { from: address });

    console.log(`Approve to provisioningContractFactory spend "${partyName}" tokens`);
    await kimlicTokenInstance.approve(ProvisioningContractFactory.address, tokensToSendAmount, { from: address });

    
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