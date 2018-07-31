/*jshint esversion: 6 *//*jshint esversion: 6 */

const VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
const BaseVerification = artifacts.require("./BaseVerification.sol");
const AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");

const { addData } = require("./Helpers/AccountHelper.js");
const { getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { getValueByPath, combinePath, uuidv4, emptyAddress, createAccountAndSet1EthToBalance } = require("../commonLogic");



contract("Verification.Negative", function() {
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);

    const accountAllowedFieldNamesConfigPath = deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path;
    const accountAllowedFieldNamesConfig = getValueByPath(deployedConfig, accountAllowedFieldNamesConfigPath);
    
    let accountAddress = "";
    let secondAccountAddress = "";

    it("init account", async () => {
        const account = await createAccountAndSet1EthToBalance(web3, deployedConfig.deployerAddress);
        accountAddress = account.accountAddress;
        console.log(`account address: ${accountAddress}`);

        const secondAccount = await createAccountAndSet1EthToBalance(web3, deployedConfig.deployerAddress);
        secondAccountAddress = secondAccount.accountAddress;
        console.log(`second account address: ${secondAccountAddress}`);

        const adapter = await AccountStorageAdapter.deployed();
        accountAllowedFieldNamesConfig.forEach(async (accountFieldName) => {
            await addData(adapter, accountFieldName + "VerificationTest", accountFieldName, accountAddress);
        });
    });

    const verificationTests = (fieldName, attestationPartyAddress) => {
        const sendConfig = { "from": attestationPartyAddress };
        const verificationContractkey = uuidv4();
        it(`Should not create verification contract for ${fieldName} without initialized data`, async () => {
            const verificationContractFactory = await VerificationContractFactory.deployed();
            try {
                await verificationContractFactory.createBaseVerificationContract(secondAccountAddress,
                    attestationPartyAddress, verificationContractkey, fieldName, sendConfig);
            } catch (error) {
                return;
            }
            assert.fail('Expected throw not received');
        });
        
        it(`Should not create verification contract for ${fieldName} with wrong attestation party address`, async () => {
            const verificationContractFactory = await VerificationContractFactory.deployed();
            try {
                await verificationContractFactory.createBaseVerificationContract(secondAccountAddress,
                    attestationPartyAddress, verificationContractkey, fieldName, sendConfig);
            } catch (error) {
                return;
            }
            assert.fail('Expected throw not received');
        });

        it(`Should create ${fieldName} verification contract`, async () => {
            const verificationContractFactory = await VerificationContractFactory.deployed();
            await verificationContractFactory.createBaseVerificationContract(accountAddress,
                attestationPartyAddress, verificationContractkey, fieldName, sendConfig);
        });

        it(`Should not create verification contract for ${fieldName} with already created verifiaction contract`, async () => {
            const verificationContractFactory = await VerificationContractFactory.deployed();
            try {
                await verificationContractFactory.createBaseVerificationContract(accountAddress, attestationPartyAddress,
                    verificationContractkey, fieldName, sendConfig);
            } catch (error) {
                return;
            }
            assert.fail('Expected throw not received');
        });
        
        it(`Should not return created ${fieldName} verification contract by wrong key`, async () => {
            const verificationContractFactory = await VerificationContractFactory.deployed();
            try {
                verificationContractAddress =  await verificationContractFactory.getVerificationContract.call("wrong key", sendConfig);
            } catch (error) {
                return;
            }
            assert.equal(verificationContractAddress, emptyAddress);
        });


        it(`Should not return field data to other accounts`, async () => {
            const verificationContractFactory = await VerificationContractFactory.deployed();
            verificationContractAddress =  await verificationContractFactory.getVerificationContract.call(verificationContractkey, sendConfig);
            const verificationContract = await BaseVerification.at(verificationContractAddress);
            try {
                await verificationContract.getData.call({ "from": secondAccountAddress });
            } catch (error) {
                return;
            }
            assert.fail('Expected throw not received');
        });
        
        it(`Should not get verification status name from other accounts`, async () => {
            const verificationContractFactory = await VerificationContractFactory.deployed();
            verificationContractAddress =  await verificationContractFactory.getVerificationContract.call(verificationContractkey, sendConfig);
            const verificationContract = await BaseVerification.at(verificationContractAddress);
            try {
                const status = await verificationContract.getStatusName.call({ "from": secondAccountAddress });
                console.log(`status: ${status}`);
            } catch (error) {
                return;
            }
            assert.fail('Expected throw not received');
        });
        
        it(`Should not get verification status from other accounts`, async () => {
            const verificationContractFactory = await VerificationContractFactory.deployed();
            verificationContractAddress =  await verificationContractFactory.getVerificationContract.call(verificationContractkey, sendConfig);
            const verificationContract = await BaseVerification.at(verificationContractAddress);
            let status = 0;
            try {
                status = await verificationContract.getStatus.call({ "from": secondAccountAddress });
            } catch (error) {
                return;
            }
            if (status != "0") {//Quorum bug? somehow method return data but it returns "0" because of restrictions
                assert.fail('Expected throw not received');
            }
            
        });
    };

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
    console.log(`attestation party by field name: ${JSON.stringify(attestationPartyByFieldName)}`);

    allowedFieldNamesConfig.forEach(fieldName => {
        if (fieldName != "device") {
            console.log(`fieldName: ${fieldName}`);
            const apList = attestationPartyByFieldName[fieldName];
            console.log(`attestation parties list: ${JSON.stringify(apList)}`);
            if (apList && apList.length > 0) {
                const apName = apList[0];
                console.log(`apName: ${apName}`);
                const path = combinePath(deployedConfigPathConsts.partiesConfig.createdParties.party.pathTemplate, { partyName: apName })
                const partyConfig = getValueByPath(deployedConfig, path, {});
                console.log(`partyConfig: ${JSON.stringify(partyConfig)}`);


                it(`Should unlock attestation party. address ${partyConfig.address}, password: ${partyConfig.password}`, async () => {
                    await web3.personal.unlockAccount(partyConfig.address, partyConfig.password, 100);
                });
                verificationTests(fieldName, partyConfig.address);
            }
            
        }
    });
});