/*jshint esversion: 6 *//*jshint esversion: 6 */
const VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
const BaseVerification = artifacts.require("./BaseVerification.sol");
const AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
const ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
const ProvisioningContract = artifacts.require("./ProvisioningContract.sol");
const KimlicToken = artifacts.require("./KimlicToken.sol");

const { addData, getFieldLastMainData, getFieldLastVerificationData } = require("./Helpers/AccountHelper.js");
const { getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { getValueByPath, combinePath, uuidv4 } = require("../commonLogic/commonLogic");
const { emptyAddress, createAccountAndSet1EthToBalance } = require("../commonLogic/commonEthereumLogic");


contract("Provisioning", function() {
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);
    var accountAddress = "";

    it("init account", async () => {
        const account = await createAccountAndSet1EthToBalance(web3, deployedConfig.deployerAddress);
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
        it(`Should init account with verified "${fieldName}" data`, async () => {
            const adapter = await AccountStorageAdapter.deployed();
            await addData(adapter, fieldName + "ProvisioningTest", fieldName, accountAddress);

            const verificationContractFactory = await VerificationContractFactory.deployed();
            await verificationContractFactory.createBaseVerificationContract(accountAddress, attestationPartyAddress,
                verificationContractkey, fieldName, relyingPartySendConfig);
            const verificationContractAddress =  await verificationContractFactory.getVerificationContract.call(verificationContractkey, attestationPartySendConfig);
            const verificationContract = await BaseVerification.at(verificationContractAddress);
            await verificationContract.finalizeVerification(true, attestationPartySendConfig);
        });

        let beforeCreateBalance;
        let afterCreateBalance;
        it(`Should create provisioning "${fieldName}" contract`, async () => {
            const kimlicToken = await KimlicToken.deployed();
            beforeCreateBalance = new web3.BigNumber(await kimlicToken.balanceOf.call(relyingPartyConfig.address));

            const provisioningContractFactory = await ProvisioningContractFactory.deployed();
            await provisioningContractFactory.createProvisioningContract(accountAddress, fieldName, provisioningContractkey, relyingPartySendConfig);

            afterCreateBalance = new web3.BigNumber(await kimlicToken.balanceOf.call(relyingPartyConfig.address));
        });
        
        var provisioningContractAddress;
        it(`Should return created provisioning contract by key`, async () => {
            const provisioningContractFactory = await ProvisioningContractFactory.deployed();
            provisioningContractAddress =  await provisioningContractFactory.getProvisioningContract.call(provisioningContractkey, relyingPartySendConfig);
            assert.notEqual(provisioningContractAddress, emptyAddress);
        });

        let reward;
        it(`Should reduce relying party balnce while create contract`, async () => {
            const provisioningContract = await ProvisioningContract.at(provisioningContractAddress);
            reward = new web3.BigNumber(await provisioningContract.rewardAmount.call());
            const balancesDiff = beforeCreateBalance.sub(afterCreateBalance);
            assert.equal(balancesDiff.toString(), reward.toString());
        });

        it(`Should get isVerificationFinished = true`, async () => {
            const provisioningContract = await ProvisioningContract.at(provisioningContractAddress);
            const isVerificationFinished = await provisioningContract.isVerificationFinished.call(relyingPartySendConfig);
            assert.equal(isVerificationFinished, true);
        });

        it(`Should set finalize provisioning`, async () => {
            const provisioningContract = await ProvisioningContract.at(provisioningContractAddress);
            await provisioningContract.finalizeProvisioning(relyingPartySendConfig);
        });

        
        it(`Should send tokens back to RP`, async () => {
            const kimlicToken = await KimlicToken.deployed();
            let afterFinishBalance = new web3.BigNumber(await kimlicToken.balanceOf.call(relyingPartyConfig.address));
            assert.equal(afterFinishBalance.toString(), beforeCreateBalance.toString());
        });

        it(`Should return field details to owner.`, async () => {
            const provisioningContract = await ProvisioningContract.at(provisioningContractAddress);
            const data = await provisioningContract.getData.call(relyingPartySendConfig, relyingPartySendConfig);
            
            const adapter = await AccountStorageAdapter.deployed();
            const accountMainData = [ await getFieldLastMainData(adapter, accountAddress, fieldName, accountAddress) ];
            const accountVerificationData = await getFieldLastVerificationData(adapter, accountAddress, fieldName, accountAddress);
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