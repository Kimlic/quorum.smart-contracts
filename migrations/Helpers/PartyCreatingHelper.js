/*jshint esversion: 6 */

const { deployedConfigPathConsts } = require("../../deployedConfigHelper");
const { setValueByPath, combinePath } = require("../../commonLogic/commonLogic");
const { sendEthToAccount } = require("../../commonLogic/commonEthereumLogic");

const setupAPAccessToFieldVerification = async (deployedConfig, attestationPartyStorageAdapter, partyName, apAddress, allowedFields) => {
    const adapter = await attestationPartyStorageAdapter.deployed();
    allowedFields.forEach(fieldName => {
        adapter.addAccessToFieldVerification(apAddress, fieldName);
    });
    
    const allowedFieldNamesPath = combinePath(deployedConfigPathConsts.partiesConfig.createdParties.party.allowedFieldNames.pathTemplate,
        { partyName: partyName });
    setValueByPath(deployedConfig, allowedFieldNamesPath, allowedFields);
};

const setupParty = async (web3, deployedConfig, contracts, partyName, address, password) => {
  if (address === null) {
    address = web3.personal.newAccount(password);
    console.log(`Created new "${partyName}" party address: "${address}", password: "${password}"`);
    web3.personal.unlockAccount(address, password, 100);
  }

  console.log(`Setyp party: ${partyName}, ${address}, ${password}`)
  console.log("Sending eth to created address");
  sendEthToAccount(web3, deployedConfig.deployerAddress, address );
    
  const kimlicTokenInstance = await contracts.kimlicToken.deployed();
  console.log(`Send tokens to "${partyName}" account`);
  await kimlicTokenInstance.transfer(address, 10000 * Math.pow(10, 18));//10^18 its token decimals
    
  const balance = await kimlicTokenInstance.balanceOf.call(address);
  console.log(`Balance of created account - "${balance / Math.pow(10, 18)}"`);//10^18 its token decimals
  
  console.log(`Approve to verificationContractFactory spend "${partyName}" tokens`);
  await kimlicTokenInstance.approve(contracts.verificationContractFactory.address, 10000 * Math.pow(10, 18), { from: address });//10^18 its token decimals
  const allowance = await kimlicTokenInstance.allowance.call(address, contracts.verificationContractFactory.address, { from: address }) / Math.pow(10, 18);//10^18 its token decimals
  console.log(`Allowance from "${address}" to verification contract factory at address "${contracts.verificationContractFactory.address}" - ${allowance}`);

  console.log(`Approve to provisioningContractFactory spend "${partyName}" tokens`);
  await kimlicTokenInstance.approve(contracts.provisioningContractFactory.address, 10000 * Math.pow(10, 18), { from: address });//10^18 its token decimals

  const provisioningAllowance = await kimlicTokenInstance.allowance.call(address, contracts.provisioningContractFactory.address, { from: address }) / Math.pow(10, 18);//10^18 its token decimals
  console.log(`Allowance from "${address}" to provisioning contract factory at address "${contracts.provisioningContractFactory.address}" - ${provisioningAllowance}`);

  return { address: address, password: password };
}

module.exports = { setupAPAccessToFieldVerification, setupParty }