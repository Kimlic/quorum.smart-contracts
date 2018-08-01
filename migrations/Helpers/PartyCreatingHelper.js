/*jshint esversion: 6 */

const { deployedConfigPathConsts } = require("../../deployedConfigHelper");
const { setValueByPath, combinePath } = require("../../commonLogic");



const setupAPAccessToFieldVerification = async (deployedConfig, attestationPartyStorageAdapter, name, apAddress, allowedFields) => {
    const adapter = await attestationPartyStorageAdapter.deployed();
    allowedFields.forEach(fieldName => {
        adapter.addAccessToFieldVerification(apAddress, fieldName);
    });
    
    const allowedFieldNamesPath = combinePath(deployedConfigPathConsts.partiesConfig.createdParties.party.allowedFieldNames.pathTemplate,
        { partyName: name });
    setValueByPath(deployedConfig, allowedFieldNamesPath, allowedFields);
};

const setupParty = async (web3, deployedConfig, contracts, name, password) => {
    const address = web3.personal.newAccount(password);
    console.log(`Created new "${name}" party address: "${address}", password: "${password}"`);
    web3.personal.unlockAccount(address, password, 100);

    console.log("Sending eth to created address");
    web3.eth.sendTransaction({from: deployedConfig.deployerAddress, to: address, value: "0xDE0B6B3A7640000"});//1 eth
    
    const kimlicTokenInstance = await contracts.kimlicToken.deployed();
    console.log(`Send tokens to "${name}" account`);
    await kimlicTokenInstance.transfer(address, 10000 * Math.pow(10, 18));//10^18 its token decimals
    
    const balance = await kimlicTokenInstance.balanceOf.call(address);
    console.log(`Balance of created account - "${balance / Math.pow(10, 18)}"`);//10^18 its token decimals
    

    console.log(`Approve to verificationContractFactory spend "${name}" tokens`);
    await kimlicTokenInstance.approve(contracts.verificationContractFactory.address, 10000 * Math.pow(10, 18), { from: address });//10^18 its token decimals
    const allowance = await kimlicTokenInstance.allowance.call(address, contracts.verificationContractFactory.address, 
        { from: address }) / Math.pow(10, 18);//10^18 its token decimals
    console.log(`Allowance from "${address}" to verification contract factory at address "${contracts.verificationContractFactory.address}" - ${allowance}`);

    console.log(`Approve to provisioningContractFactory spend "${name}" tokens`);
    await kimlicTokenInstance.approve(contracts.provisioningContractFactory.address, 10000 * Math.pow(10, 18), { from: address });//10^18 its token decimals

    const provisioningAllowance = await kimlicTokenInstance.allowance.call(address, contracts.provisioningContractFactory.address,
        { from: address }) / Math.pow(10, 18);//10^18 its token decimals
    console.log(`Allowance from "${address}" to provisioning contract factory at address "${contracts.provisioningContractFactory.address}" - ${provisioningAllowance}`);

    return { address: address, password: password };
};

module.exports = { setupAPAccessToFieldVerification, setupParty };