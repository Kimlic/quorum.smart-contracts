
const KimlicToken = artifacts.require("./KimlicToken.sol");
const AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");

const { getNetworkDeployedConfig, deployedConfigPathConsts, saveDeployedConfig } = require("../deployedConfigHelper");
const { sendEthToAccount } = require("../commonLogic/commonEthereumLogic");
const { setValueByPath, getValueByPath, combinePath } = require("../commonLogic/commonLogic");

// Parameters

const apName = "veriff"
const apCoinbaseAddress = "0xa6eccf2ffdf93a7c7d90334ecbbc06c806636a5d"
const apTokens = 1000
const grantAccessToFields = [
  "documents.id_card", 
  "documents.passport", 
  "documents.driver_license", 
  "documents.residence_permit_card"
]
const removeAccessToFields = []

/**
 * Script to be run by Kimlic team to perform AP registration procedure
 */

// TODO: successfully started from master node

module.exports = async function (callback) {//Temp script for manual add AP/RP
  const deployedConfig = getNetworkDeployedConfig(web3.version.network);
  const mainAddressPath = deployedConfigPathConsts.deployerAddress.path;
  const mainAddress = getValueByPath(deployedConfig, mainAddressPath, "0x0");
  console.log(`mainAddress: ${mainAddress}`)

  sendEthToAccount(web3, mainAddress, apCoinbaseAddress);
  console.log(`Send tokens to "${apName}" account`);

  const tokensToSendAmount = apTokens * Math.pow(10, 18);
  const kimlicTokenInstancePath = deployedConfigPathConsts.deployedContracts.kimlicTokenAddress.path;
  const kimlicTokenInstanceAddress = getValueByPath(deployedConfig, kimlicTokenInstancePath, "0x0");
  console.log(`kimlicTokenInstanceAddress: ${kimlicTokenInstanceAddress}`)
  const kimlicTokenInstance = await KimlicToken.at(kimlicTokenInstanceAddress);

  console.log(`send tokens to account "${tokensToSendAmount / Math.pow(10, 18)}"`);//10^18 its token decimals
  console.log(`main acc balance: ${await kimlicTokenInstance.balanceOf(mainAddress)}`);
  await kimlicTokenInstance.transfer(apCoinbaseAddress, tokensToSendAmount, { from: mainAddress });

  console.log(`balance: ${await kimlicTokenInstance.balanceOf(apCoinbaseAddress)}`);

  const partyConfigPath = deployedConfigPathConsts.partiesConfig.createdParties.party.address.pathTemplate;
  setValueByPath(deployedConfig, combinePath(partyConfigPath, { partyName: apName }), apCoinbaseAddress);
  console.log("apCoinbaseAddress saved")

  const allowedFieldNamesConfigPath = deployedConfigPathConsts.partiesConfig.createdParties.party.allowedFieldNames.pathTemplate;
  const allowedFieldNames = getValueByPath(deployedConfig, combinePath(allowedFieldNamesConfigPath, { partyName: apName }), []);
  console.log(`allowed field names: ${allowedFieldNames}`)

  const attestationPartyStorageAdapterPath = deployedConfigPathConsts.deployedContracts.attestationPartyStorageAdapterAddress.path;
  const attestationPartyStorageAdapterAddress = getValueByPath(deployedConfig, attestationPartyStorageAdapterPath, "0x0");
  console.log(`attestation party storage adapter address: ${attestationPartyStorageAdapterAddress}`)
  const adapter = await AttestationPartyStorageAdapter.at(attestationPartyStorageAdapterAddress);

  for (const fieldName of removeAccessToFields) {
    console.log(`Remove access to verify field ${fieldName} from address ${apCoinbaseAddress}`);
    await adapter.removeAccessToFieldVerification(apCoinbaseAddress, fieldName);
    const allowedFieldIndex = allowedFieldNames.indexOf(fieldName);

    if (allowedFieldIndex >= 0) {
      allowedFieldNames.splice(allowedFieldIndex, 1);
    }
  }

  for (const fieldName of grantAccessToFields) {
    console.log(`Grant access to verify field ${fieldName} from apCoinbaseAddress ${apCoinbaseAddress}`);
    const allowedFieldIndex = allowedFieldNames.indexOf(fieldName);

    if (allowedFieldIndex < 0) {
      allowedFieldNames.push(fieldName);
      await adapter.addAccessToFieldVerification(apCoinbaseAddress, fieldName);
      var isAllowed = await adapter.getIsFieldVerificationAllowed(apCoinbaseAddress, fieldName);
      console.log(`success: ${isAllowed}`)
    }
  }

  saveDeployedConfig();
  callback.call();
}