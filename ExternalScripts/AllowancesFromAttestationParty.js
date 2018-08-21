
const KimlicToken = artifacts.require("./KimlicToken.sol");

const { getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { getValueByPath } = require("../commonLogic/commonLogic");

/**
 * Script to be run at AP / RP peer node to grant permissions to Verification / Provisioning factories to take tokens from AP / RP balance
 */
module.exports = async function(callback) {//Temp script for manual add AP/RP
    const partyName = "test";
    const address = "0x0bb5812cdabd4d07497d5364005e8149770db1bf";

    web3.personal.unlockAccount(address, "123456", 10000);


    const deployedConfig = getNetworkDeployedConfig(web3.version.network);
    console.log(`Send tokens to "${partyName}" account`);

    const tokensToSendAmount = 10000 * Math.pow(10, 18);
    const kimlicTokenInstancePath = deployedConfigPathConsts.deployedContracts.kimlicTokenAddress.path;
    const kimlicTokenInstanceAddress = getValueByPath(deployedConfig, kimlicTokenInstancePath, "0x0");
    const kimlicTokenInstance = await KimlicToken.at(kimlicTokenInstanceAddress);
    
    console.log(`Approve to verificationContractFactory spend "${partyName}" tokens`);
    const verificationContractFactoryAddressPath = deployedConfigPathConsts.deployedContracts.verificationContractFactoryAddress.path;
    const verificationContractFactoryAddress = getValueByPath(deployedConfig, verificationContractFactoryAddressPath, "0x0");
    await kimlicTokenInstance.approve(verificationContractFactoryAddress, tokensToSendAmount, { from: address });

    console.log(`allowance: ${await kimlicTokenInstance.allowance.call(address, verificationContractFactoryAddress)}`);

    console.log(`Approve to provisioningContractFactory spend "${partyName}" tokens`);
    const provisioningContractFactoryAddressPath = deployedConfigPathConsts.deployedContracts.provisioningContractFactoryAddress.path;
    const provisioningContractFactoryAddress = getValueByPath(deployedConfig, provisioningContractFactoryAddressPath, "0x0");
    await kimlicTokenInstance.approve(provisioningContractFactoryAddress, tokensToSendAmount, { from: address });

    console.log(`allowance: ${await kimlicTokenInstance.allowance.call(address, provisioningContractFactoryAddress)}`);

    callback.call();
}