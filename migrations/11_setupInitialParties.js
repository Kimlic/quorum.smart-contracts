/*jshint esversion: 6 */
const VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
const ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
const AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");
const KimlicToken = artifacts.require("./KimlicToken.sol");

const { getFormatedConsoleLabel } = require("../commonLogic");
const { saveDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { setValueByPath, getValueByPath, combinePath } = require("../commonLogic");



module.exports = function(deployer) {
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);
    const configPath = deployedConfigPathConsts.partiesConfig.createdParties.path;
    const currentSetup = getValueByPath(deployedConfig, configPath);

    deployer.then(async () => {
        console.log(getFormatedConsoleLabel("Setup initial parties: Kimlic, Veriff, FirstRelyingParty"));
        const kimlicTokenInstance = await KimlicToken.deployed();

        const veriffName = "veriff";
        currentSetup[veriffName] = await setupParty(kimlicTokenInstance, veriffName, veriffName + "p@ssw0rd");
        await setupAPAccessToFieldVerification(veriffName, currentSetup[veriffName].address, 
            ["documents.id_card", "documents.passport", "documents.driver_license", "documents.residence_permit_card"]);
        
        const kimlicName = "kimlic";
        currentSetup[kimlicName] = await setupParty(kimlicTokenInstance, kimlicName, kimlicName + "p@ssw0rd");
        await setupAPAccessToFieldVerification(kimlicName, currentSetup[kimlicName].address, ["email", "phone"]);

        const relyingPartyName = "firstRelyingParty";
        currentSetup[relyingPartyName] = await setupParty(kimlicTokenInstance, relyingPartyName, relyingPartyName + "p@ssw0rd");
        console.log(JSON.stringify(currentSetup, null, 4));

        saveDeployedConfig();
    });

    const setupAPAccessToFieldVerification = async (name, apAddress, allowedFields) => {
        const adapter = await AttestationPartyStorageAdapter.deployed();
        allowedFields.forEach(fieldName => {
            adapter.addAccessToFieldVerification(apAddress, fieldName);
        });
        
        const allowedFieldNamesPath = combinePath(deployedConfigPathConsts.partiesConfig.createdParties.party.allowedFieldNames.pathTemplate,
            { partyName: name });
        setValueByPath(deployedConfig, allowedFieldNamesPath, allowedFields);
    };

    const setupParty = async (kimlicTokenInstance, name, password) => {
        const address = web3.personal.newAccount(password);
        console.log(`Created new "${name}" party address: "${address}", password: "${password}"`);
        web3.personal.unlockAccount(address, password, 100);

        console.log("Sending eth to created address");
        web3.eth.sendTransaction({from: web3.eth.coinbase, to: address, value: "0xDE0B6B3A7640000"});//1 eth
        

        console.log(`Send tokens to "${name}" account`);
        await kimlicTokenInstance.transfer(address, 10000 * Math.pow(10, 18));//10^18 its token decimals
        
        const balance = await kimlicTokenInstance.balanceOf.call(address);
        console.log(`Balance of created account - "${balance}"`);

        console.log(`Approve to VerificationContractFactory spend "${name}" tokens`);
        await kimlicTokenInstance.approve(VerificationContractFactory.address, 10000 * Math.pow(10, 18), { from: address });//10^18 its token decimals

        const allowance = await kimlicTokenInstance.allowance.call(address, VerificationContractFactory.address, 
            { from: address }) / Math.pow(10, 18);//10^18 its token decimals
        console.log(`Allowance from "${address}" to verification contract factory at address "${VerificationContractFactory.address}" - ${allowance}`);

        console.log(`Approve to ProvisioningContractFactory spend "${name}" tokens`);
        await kimlicTokenInstance.approve(ProvisioningContractFactory.address, 10000 * Math.pow(10, 18), { from: address });//10^18 its token decimals

        const provisioningAllowance = await kimlicTokenInstance.allowance.call(address, ProvisioningContractFactory.address,
            { from: address }) / Math.pow(10, 18);//10^18 its token decimals
        console.log(`Allowance from "${address}" to provisioning contract factory at address "${ProvisioningContractFactory.address}" - ${provisioningAllowance}`);

        return { address: address, password: password };
    };
};
