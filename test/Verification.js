/*jshint esversion: 6 *//*jshint esversion: 6 */
let fs = require("fs");

let VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
let BaseVerification = artifacts.require("./BaseVerification.sol");
let AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");

let { accountConsts, addAccountData, getAccountFieldLastMainData, getAccountLastDataIndex } = require("./Helpers/AccountHelper.js")


contract("Verification", function(accounts) {
    
    let accountAddress = accounts[0];

    it("init account", async () => {
        let adapter = await AccountStorageAdapter.deployed();
        await addAccountData(adapter, accountAddress, accountConsts.phoneValue + "VerificationTest", accountConsts.phoneFieldName);
        await addAccountData(adapter, accountAddress, accountConsts.emailValue + "VerificationTest", accountConsts.emailFieldName);
        //await addAccountData(adapter, accountAddress, accountConsts.identityValue + "VerificationTest", accountConsts.identityFieldName);
        await addAccountData(adapter, accountAddress, accountConsts.documentValue + "VerificationTest", accountConsts.documentsFieldName);
        //await addAccountData(adapter, accountAddress, accountConsts.addressValue + "VerificationTest", accountConsts.addressesFieldName);
    });

    let verificationTests = (factoryMethodName, fieldName, attestationPartyAddress, verificationContractkey, sendConfig) => {
        it(`Should create ${fieldName} verification contract`, async () => {
            let verificationContractFactory = await VerificationContractFactory.deployed();
            await verificationContractFactory[factoryMethodName](accountAddress,
                attestationPartyAddress, verificationContractkey, sendConfig);
        });
        
        var verificationContractAddress;
        it(`Should return created ${fieldName} verification contract by key ${verificationContractkey}`, async () => {
            let verificationContractFactory = await VerificationContractFactory.deployed();
            verificationContractAddress =  await verificationContractFactory.getVerificationContract.call(verificationContractkey, sendConfig);
            assert.notEqual(verificationContractAddress, "0x0000000000000000000000000000000000000000");
        });

        it(`Should return field data to owner.`, async () => {
            let verificationContract = await BaseVerification.at(verificationContractAddress);
            let data = await verificationContract.getData.call({ "from": attestationPartyAddress });
            
            let adapter = await AccountStorageAdapter.deployed();
            let accountData = await getAccountFieldLastMainData(adapter, accountAddress, fieldName);
            assert.deepEqual(data, accountData);
        });
        
        it(`Should set verification ${fieldName} result`, async () => {
            let verificationContract = await BaseVerification.at(verificationContractAddress);
            await verificationContract.setVerificationResult(true, { "from": attestationPartyAddress });
        });
        
        it(`Should get verification status. Status must be "Verified"(1)`, async () => {
            let verificationContract = await BaseVerification.at(verificationContractAddress);
            let verificationStatus = await verificationContract.status.call();
            assert.equal(verificationStatus, true);
        });
    };



    let uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    
    let getPartiesConfig = () => {
        let partiesConfigFileName = "PartiesConfig.json";
        var partiesConfig = {};
        if (fs.existsSync(partiesConfigFileName)) {
            console.log(`Reading parties config from file "${partiesConfigFileName}"`);
            partiesConfig = { ...partiesConfig, ...JSON.parse(fs.readFileSync(partiesConfigFileName))};
        }
        return partiesConfig;
    };

    let verificatorAddress = accounts[0];//TODO replace by real verificator address;

    let config = getPartiesConfig();
    let kimlicConfig = config["Kimlic"];
    let veriffConfig = config["Veriff"];
    let relyingPartyConfig = config["FirstRelyingParty"];
    
    it("Should unlock verificators accounts", async () => {
        await web3.personal.unlockAccount(kimlicConfig.address, kimlicConfig.password);
        await web3.personal.unlockAccount(veriffConfig.address, veriffConfig.password);
        await web3.personal.unlockAccount(relyingPartyConfig.address, relyingPartyConfig.password);
    });
    
    verificationTests("createEmailVerification", accountConsts.emailFieldName, kimlicConfig.address, uuidv4(), { "from": kimlicConfig.address });

    verificationTests("createPhoneVerification", accountConsts.phoneFieldName, kimlicConfig.address, uuidv4(), { "from": kimlicConfig.address });
    
    verificationTests("createDocumentVerification", accountConsts.documentsFieldName, veriffConfig.address, uuidv4(), { "from": relyingPartyConfig.address });
    
});
