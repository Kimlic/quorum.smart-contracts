/*jshint esversion: 6 *//*jshint esversion: 6 */
const VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
const BaseVerification = artifacts.require("./BaseVerification.sol");
const AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
const ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
const ProvisioningContract = artifacts.require("./ProvisioningContract.sol");

const { addAccountData, getAccountFieldLastMainData, 
    getAccountFieldLastVerificationData, createAccountAndSet1EthToBalance } = require("./Helpers/AccountHelper.js");
const { loadDeployedConfigIntoCache, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { getValueByPath, combinePath, uuidv4 } = require("../commonLogic");


contract("Provisioning", function() {
    loadDeployedConfigIntoCache();
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);
    var accountAddress = "";

    it("init account", async () => {
        const account = await createAccountAndSet1EthToBalance(web3);
        accountAddress = account.accountAddress;
        console.log(`accountAddress: ${accountAddress}`);
    });

    const testProvisioning = (fieldName, attestationPartyAddress) => {
        const path = combinePath(deployedConfigPathConsts.partiesConfig.createdParties.party.pathTemplate, { partyName: "firstRelyingParty" });
        const relyingPartyConfig = getValueByPath(deployedConfig, path, {});
        relyingPartySendConfig = { from: relyingPartyConfig.address};
        it("Should unlock relying party account", async () => {
            await web3.personal.unlockAccount(relyingPartyConfig.address, relyingPartyConfig.password, 100);
        });

        const provisioningContractkey = uuidv4();
        const verificationContractkey = uuidv4();
        const attestationPartySendConfig = { from: attestationPartyAddress };
        it("Should init account with verified data", async () => {
            const adapter = await AccountStorageAdapter.deployed();
            await addAccountData(adapter, accountAddress, fieldName + "ProvisioningTest", fieldName);
            const verificationContractFactory = await VerificationContractFactory.deployed();
            await verificationContractFactory.createBaseVerificationContract(accountAddress, attestationPartyAddress,
                verificationContractkey, fieldName, relyingPartySendConfig);


            const verificationContractAddress =  await verificationContractFactory.getVerificationContract.call(verificationContractkey, attestationPartySendConfig);
            const verificationContract = await BaseVerification.at(verificationContractAddress);
            await verificationContract.setVerificationResult(true, attestationPartySendConfig);
        });


        it(`Should create provisioning contract`, async () => {
            const provisioningContractFactory = await ProvisioningContractFactory.deployed();
            await provisioningContractFactory.createProvisioningContract(accountAddress, fieldName, provisioningContractkey, relyingPartySendConfig);
        });
        
        var provisioningContractAddress;
        it(`Should return created provisioning contract by key`, async () => {
            const provisioningContractFactory = await ProvisioningContractFactory.deployed();
            provisioningContractAddress =  await provisioningContractFactory.getProvisioningContract.call(provisioningContractkey, relyingPartySendConfig);
            assert.notEqual(provisioningContractAddress, "0x0000000000000000000000000000000000000000");
        });

        it(`Should get isVerificationFinished = true`, async () => {
            const provisioningContract = await ProvisioningContract.at(provisioningContractAddress);
            const isVerificationFinished = await provisioningContract.isVerificationFinished.call(relyingPartySendConfig);
            assert.equal(isVerificationFinished, true);
        });

        it(`Should set provisioning result`, async () => {
            const provisioningContractFactory = await ProvisioningContract.at(provisioningContractAddress);
            await provisioningContractFactory.setDataProvidedStatus(relyingPartySendConfig);
        });

        it(`Should return field data to owner.`, async () => {
            const provisioningContractFactory = await ProvisioningContract.at(provisioningContractAddress);
            const data = await provisioningContractFactory.getData.call(relyingPartySendConfig, relyingPartySendConfig);
            
            const adapter = await AccountStorageAdapter.deployed();
            const accountMainData = [ await getAccountFieldLastMainData(adapter, accountAddress, fieldName, attestationPartySendConfig) ];
            const accountVerificationData = await getAccountFieldLastVerificationData(adapter, accountAddress, fieldName, attestationPartySendConfig);
            const accountData = accountMainData.concat(accountVerificationData);
            assert.deepEqual(data, accountData);
        });
    }
    const allowedFieldNamesConfig = getValueByPath(deployedConfig,
        deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path);
    
    const partiesConfig = getValueByPath(deployedConfig, deployedConfigPathConsts.partiesConfig.createdParties.path);
    
    const attestationPartyByFieldName = {};

    Object.keys(partiesConfig).forEach(party => {
        const path = combinePath(deployedConfigPathConsts.partiesConfig.createdParties.party.allowedFieldNames.pathTemplate, { partyName: party })
        const partyAllowedFields = getValueByPath(deployedConfig, path, []);
        partyAllowedFields.forEach(allowedFieldName => {
            if (!attestationPartyByFieldName[allowedFieldName]) {
                attestationPartyByFieldName[allowedFieldName] = [];
            }
            const attestationPartiesForField = attestationPartyByFieldName[allowedFieldName];
            attestationPartiesForField.push(party);
        });
    });

    allowedFieldNamesConfig.forEach(fieldName => {
        if (fieldName != "device") {
            console.log(`fieldName: ${fieldName}`);
            const attestationPartyList = attestationPartyByFieldName[fieldName];
            console.log(`attestation parties list: ${JSON.stringify(attestationPartyList)}`);
            if (attestationPartyList && attestationPartyList.length > 0) {
                const attestationPartyName = attestationPartyList[0];
                console.log(`attestation party name: ${attestationPartyName}`);
                const path = combinePath(deployedConfigPathConsts.partiesConfig.createdParties.party.pathTemplate, { partyName: attestationPartyName })
                const partyConfig = getValueByPath(deployedConfig, path, {});
                console.log(`partyConfig: ${JSON.stringify(partyConfig)}`);


                it(`Should unlock attestation party. address ${partyConfig.address}, password: ${partyConfig.password}`, async () => {
                    await web3.personal.unlockAccount(partyConfig.address, partyConfig.password, 100);
                });
                testProvisioning(fieldName, partyConfig.address);
            }
            
        }
    });
    
});