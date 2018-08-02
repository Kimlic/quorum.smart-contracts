/*jshint esversion: 6 */
const KimlicToken = artifacts.require("./KimlicToken.sol");
const VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
const ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
const AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");

const { setupAPAccessToFieldVerification, setupParty } = require("./Helpers/PartyCreatingHelper");
const { getFormatedConsoleLabel, getValueByPath } = require("../commonLogic/commonLogic");
const { saveDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");



module.exports = function(deployer) {
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);
    const configPath = deployedConfigPathConsts.partiesConfig.createdParties.path;
    const currentSetup = getValueByPath(deployedConfig, configPath);

    deployer.then(async () => {
        console.log(getFormatedConsoleLabel("Setup initial parties: Kimlic, Veriff, FirstRelyingParty"));
        const contracts = {
            kimlicToken: KimlicToken,
            verificationContractFactory: VerificationContractFactory,
            provisioningContractFactory: ProvisioningContractFactory
        };

        const veriffName = "veriff";
        currentSetup[veriffName] = await setupParty(web3, deployedConfig, contracts, veriffName, veriffName + "p@ssw0rd");

        await setupAPAccessToFieldVerification(deployedConfig, AttestationPartyStorageAdapter, veriffName, currentSetup[veriffName].address, 
            ["documents.id_card", "documents.passport", "documents.driver_license", "documents.residence_permit_card"]);
        
        const kimlicName = "kimlic";
        currentSetup[kimlicName] = await setupParty(web3, deployedConfig, contracts, kimlicName, kimlicName + "p@ssw0rd");
            
        await setupAPAccessToFieldVerification(deployedConfig, AttestationPartyStorageAdapter, kimlicName, currentSetup[kimlicName].address, ["email", "phone"]);

        const relyingPartyName = "firstRelyingParty";
        currentSetup[relyingPartyName] = await setupParty(web3, deployedConfig, contracts, relyingPartyName, relyingPartyName + "p@ssw0rd");
        console.log(JSON.stringify(currentSetup, null, 4));

        saveDeployedConfig();
    });
};
