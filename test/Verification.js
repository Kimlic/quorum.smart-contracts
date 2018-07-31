/*jshint esversion: 6 *//*jshint esversion: 6 */

const VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
const BaseVerification = artifacts.require("./BaseVerification.sol");
const AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
const AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");
const KimlicToken = artifacts.require("./KimlicToken.sol");

const { addData, getFieldLastMainData, getFieldDetails } = require("./Helpers/AccountHelper.js");
const { getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { getValueByPath, combinePath, uuidv4, emptyAddress, createAccountAndSet1EthToBalance } = require("../commonLogic");



contract("Verification", function() {
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);

    const accountAllowedFieldNamesConfigPath = deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path;
    const accountAllowedFieldNamesConfig = getValueByPath(deployedConfig, accountAllowedFieldNamesConfigPath);
    
    let accountAddress = "";

    it("init account", async () => {
        const account = await createAccountAndSet1EthToBalance(web3, deployedConfig.deployerAddress);
        accountAddress = account.accountAddress;

        const adapter = await AccountStorageAdapter.deployed();
        accountAllowedFieldNamesConfig.forEach(async (accountFieldName) => {
            await addData(adapter, accountFieldName + "VerificationTest", accountFieldName, accountAddress);
        });
    });

    const verificationTests = (fieldName, attestationPartyAddress) => {
        let contractCreatorConfig;
        let contractCreatorSendConfig;
        
        const initContractCreator = (creatorName) => {
            const path = combinePath(deployedConfigPathConsts.partiesConfig.createdParties.party.pathTemplate, { partyName: creatorName });
            contractCreatorConfig = getValueByPath(deployedConfig, path, {});
            contractCreatorSendConfig = { from: contractCreatorConfig.address };
            it(`Should unlock coOwner`, async () => {
                await web3.personal.unlockAccount(contractCreatorConfig.address, contractCreatorConfig.password, 100);
            });
        };

        if (fieldName == "email" || fieldName == "phone") {
            initContractCreator("kimlic");
        } else {
            initContractCreator("firstRelyingParty");
        }

        const sendConfig = { "from": attestationPartyAddress };
        const verificationContractkey = uuidv4();
        let dataIndex = 0;
        it(`Should have data in field ${fieldName}`, async () => {
            const accountStorageAdapter = await AccountStorageAdapter.deployed();
            dataIndex = await accountStorageAdapter.getFieldHistoryLength.call(accountAddress, fieldName);
            assert.notEqual(dataIndex, "0");
        });
        
        it(`Should not have verification contract for field ${fieldName}`, async () => {
            const accountStorageAdapter = await AccountStorageAdapter.deployed();
            const isContractExist = await accountStorageAdapter.getIsFieldVerificationContractExist
                .call(accountAddress, fieldName, dataIndex, { from: accountAddress });
            assert.equal(isContractExist, false);
        });
        
        it(`Should have access ${fieldName} verification from attestation party`, async () => {
            const attestationPartyStorageAdapter = await AttestationPartyStorageAdapter.deployed();
            const isFieldVerificationAllowed = await attestationPartyStorageAdapter.getIsFieldVerificationAllowed.call(attestationPartyAddress, fieldName);
            assert.equal(isFieldVerificationAllowed, true);
        });

        let beforeCreateBalance;
        let afterCreateBalance;
        it(`Should create ${fieldName} verification contract`, async () => {
            const verificationContractFactory = await VerificationContractFactory.deployed();
            const kimlicToken = await KimlicToken.deployed();
            beforeCreateBalance = new web3.BigNumber(await kimlicToken.balanceOf.call(contractCreatorConfig.address));

            await verificationContractFactory.createBaseVerificationContract(accountAddress,
                attestationPartyAddress, verificationContractkey, fieldName, contractCreatorSendConfig);

            afterCreateBalance = new web3.BigNumber(await kimlicToken.balanceOf.call(contractCreatorConfig.address));
        });
        
        var verificationContractAddress;
        it(`Should return created ${fieldName} verification contract by key ${verificationContractkey}`, async () => {
            const verificationContractFactory = await VerificationContractFactory.deployed();
            verificationContractAddress =  await verificationContractFactory.getVerificationContract.call(verificationContractkey, sendConfig);
            assert.notEqual(verificationContractAddress, emptyAddress);
        });

        let reward;
        it(`Should reduce relying party balnce while create contract`, async () => {
            const verificationContract = await BaseVerification.at(verificationContractAddress);
            reward = new web3.BigNumber(await verificationContract.rewardAmount.call());
            const balancesDiff = beforeCreateBalance.sub(afterCreateBalance);
            assert.equal(balancesDiff.toString(), reward.toString());
        });

        it(`Should return field data to owner.`, async () => {
            const verificationContract = await BaseVerification.at(verificationContractAddress);
            const data = await verificationContract.getData.call({ "from": attestationPartyAddress });
            
            const adapter = await AccountStorageAdapter.deployed();
            const accountData = await getFieldLastMainData(adapter, accountAddress, fieldName, accountAddress);
            assert.deepEqual(data, accountData);
        });

        let beforeVerificaitonFinishAPBalance;
        let afterVerificaitonFinishAPBalance;
        it(`Should set verification ${fieldName} result`, async () => {
            const kimlicToken = await KimlicToken.deployed();

            beforeVerificaitonFinishAPBalance = new web3.BigNumber(await kimlicToken.balanceOf.call(attestationPartyAddress));
            const verificationContract = await BaseVerification.at(verificationContractAddress);
            await verificationContract.finalizeVerification(true, { "from": attestationPartyAddress });
            afterVerificaitonFinishAPBalance = new web3.BigNumber(await kimlicToken.balanceOf.call(attestationPartyAddress));
        });

        it(`Should send reward to AP`, async () => {
            const balancesDiff = afterVerificaitonFinishAPBalance.sub(beforeVerificaitonFinishAPBalance);
            assert.equal(balancesDiff.toString(), reward.toString());
        });
        
        it(`Should get verification status. Status must be "Verified"(2)`, async () => {
            const verificationContract = await BaseVerification.at(verificationContractAddress);
            const verificationStatus = await verificationContract.getStatus.call({ "from": attestationPartyAddress });
            assert.equal(verificationStatus, 2);
        });
        it(`Should read account ${fieldName} full data`, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            detail = await getFieldDetails(adapter, accountAddress, fieldName, accountAddress);
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

    
    it(`Should take rewards for verified data`, async () => {
        const kimlicToken = await KimlicToken.deployed();

        const rewards = getValueByPath(deployedConfig, deployedConfigPathConsts.rewardingContractConfig.rewards.path, []);

        const balance = await kimlicToken.balanceOf.call(accountAddress);
        const rewardingAmount = Object.values(rewards).reduce((a, b) => a + b, 0);
        assert.equal(balance, rewardingAmount.toString());
    });
});