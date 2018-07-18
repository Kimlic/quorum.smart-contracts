/*jshint esversion: 6 */
let VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
let ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
let AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");
let KimlicToken = artifacts.require("./KimlicToken.sol");

let fs = require("fs");
let { getFormatedConsoleLabel } = require("./Helpers/MigrationHelper");
const { loadDeployedConfigIntoCache, saveDeployedConfig, getNetworkDeployedConfig } = require("../deployedConfigHelper");
const { getValueByPath } = require("../commonLogic");



module.exports = function(deployer, network, accounts) {
    loadDeployedConfigIntoCache();
    const deployedConfig = getNetworkDeployedConfig(network);
    const configPath = "partiesConfig.createdParties";
    const currentSetup = getValueByPath(deployedConfig, configPath);

    deployer.then(async () => {
        console.log(getFormatedConsoleLabel("Setup initial parties: Kimlic, Veriff, FirstRelyingParty"));
        let kimlicTokenInstance = await KimlicToken.deployed();

        let veriffName = "veriff";
        currentSetup[veriffName] = await setupParty(kimlicTokenInstance, veriffName, veriffName + "p@ssw0rd");
        setupAPAccessToFieldVerification(currentSetup[veriffName].address, ["documents.id_card"])
        
        let kimlicName = "kimlic";
        currentSetup[kimlicName] = await setupParty(kimlicTokenInstance, kimlicName, kimlicName + "p@ssw0rd");
        setupAPAccessToFieldVerification(currentSetup[kimlicName].address, ["email", "phone"])

        let relyingPartyName = "firstRelyingParty";
        currentSetup[relyingPartyName] = await setupParty(kimlicTokenInstance, relyingPartyName, relyingPartyName + "p@ssw0rd");
        console.log(JSON.stringify(currentSetup, null, 4));

        saveDeployedConfig();
    });

    let setupAPAccessToFieldVerification = async (apAddress, allowedFields) => {
        var adapter = await AttestationPartyStorageAdapter.deployed();
        allowedFields.forEach(fieldName => {
            adapter.addAccessToFieldVerification(apAddress, fieldName);
        });
    };

    let setupParty = async (kimlicTokenInstance, name, password) => {
        let address = web3.personal.newAccount(password);
        console.log(`Created new "${name}" party address: "${address}", password: "${password}"`);
        web3.personal.unlockAccount(address, password);

        //TODO probably we dont need this step in newer version of Quourum
        console.log("Sending eth to created address");
        web3.eth.sendTransaction({from: accounts[0], to: address, value: "0xDE0B6B3A7640000"});

        console.log(`Send tokens to "${name}" account`);
        await kimlicTokenInstance.transfer(address, 10000);
        
        let balance = await kimlicTokenInstance.balanceOf.call(address);
        console.log(`Balance of created account - "${balance}"`);

        console.log(`Approve to VerificationContractFactory spend "${name}" tokens`);
        await kimlicTokenInstance.approve(VerificationContractFactory.address, 10000, { from: address });

        let allowance = await kimlicTokenInstance.allowance.call(address, VerificationContractFactory.address, { from: address });
        console.log(`Allowance from "${address}" to verification contract factory at address "${VerificationContractFactory.address}" - ${allowance}`);

        console.log(`Approve to ProvisioningContractFactory spend "${name}" tokens`);
        await kimlicTokenInstance.approve(ProvisioningContractFactory.address, 10000, { from: address });

        let provisioningAllowance = await kimlicTokenInstance.allowance.call(address, ProvisioningContractFactory.address, { from: address });
        console.log(`Allowance from "${address}" to provisioning contract factory at address "${ProvisioningContractFactory.address}" - ${provisioningAllowance}`);

        return { address: address, password: password };
    };
};
