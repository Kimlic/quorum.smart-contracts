
const KimlicToken = artifacts.require("./KimlicToken.sol");

const { getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { getValueByPath } = require("../commonLogic/commonLogic");

const rpName = "demoKimlic";
const rpCoinbaseAddress = "0x64bead472383998573e22b191f20e0cd762fb809"; // RP coinbase address
const rpKimTokens = 10000

/**
 * Script to be run at AP / RP peer node to grant permissions to Verification / Provisioning factories to take tokens from AP / RP balance
 */

// TODO: Successfully executed from rp1

module.exports = async function (callback) { //Temp script for manual add AP/RP
  // web3.personal.unlockAccount(rpCoinbaseAddress, "", 10000);

  const deployedConfig = getNetworkDeployedConfig(web3.version.network);
  console.log(`Send tokens to "${rpName}" account`);

  const tokensToSendAmount = rpKimTokens * Math.pow(10, 18);
  const kimlicTokenInstancePath = deployedConfigPathConsts.deployedContracts.kimlicTokenAddress.path;
  const kimlicTokenInstanceAddress = getValueByPath(deployedConfig, kimlicTokenInstancePath, "0x0");
  const kimlicTokenInstance = await KimlicToken.at(kimlicTokenInstanceAddress);

  console.log(`Approve to verificationContractFactory spend "${rpName}" tokens`);
  const verificationContractFactoryAddressPath = deployedConfigPathConsts.deployedContracts.verificationContractFactoryAddress.path;
  const verificationContractFactoryAddress = getValueByPath(deployedConfig, verificationContractFactoryAddressPath, "0x0");
  await kimlicTokenInstance.approve(verificationContractFactoryAddress, tokensToSendAmount, { from: rpCoinbaseAddress });

  console.log(`allowance: ${await kimlicTokenInstance.allowance.call(rpCoinbaseAddress, verificationContractFactoryAddress)}`);

  console.log(`Approve to provisioningContractFactory spend "${rpName}" tokens`);
  const provisioningContractFactoryAddressPath = deployedConfigPathConsts.deployedContracts.provisioningContractFactoryAddress.path;
  const provisioningContractFactoryAddress = getValueByPath(deployedConfig, provisioningContractFactoryAddressPath, "0x0");
  await kimlicTokenInstance.approve(provisioningContractFactoryAddress, tokensToSendAmount, { from: rpCoinbaseAddress });

  console.log(`allowance: ${await kimlicTokenInstance.allowance.call(rpCoinbaseAddress, provisioningContractFactoryAddress)}`);

  callback.call();
}