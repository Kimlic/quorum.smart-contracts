/*jshint esversion: 6 *//*jshint esversion: 6 */
var fs = require("fs");

let VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
let BaseVerification = artifacts.require("./BaseVerification.sol");
let AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");

let { accountConsts, addAccountData, getAccountFieldLastMainData, getAccountLastDataIndex } = require("./Helpers/AccountHelper.js")


contract("Verification", function(accounts) {
    
    let accountAddress = accounts[0];

    it("init account", async () => {
        let adapter = await AccountStorageAdapter.deployed();
        await addAccountData(adapter, accountAddress, accountConsts.phoneValue, accountConsts.phoneColumnName);
        await addAccountData(adapter, accountAddress, accountConsts.emailValue, accountConsts.emailColumnName);
        //await addAccountData(adapter, accountAddress, accountConsts.identityValue, accountConsts.identityColumnName);
        await addAccountData(adapter, accountAddress, accountConsts.documentValue, accountConsts.documentsColumnName);
        //await addAccountData(adapter, accountAddress, accountConsts.addressValue, accountConsts.addressesColumnName);
    });

    let verificationTests = (factoryMethodName, columnName, coOwnerAddress, verificatorAddress,
            verificationContractkey, sendConfig) => {
        it(`Should create ${columnName} verification contract`, async () => {
            let verificationContractFactory = await VerificationContractFactory.deployed();
            await verificationContractFactory[factoryMethodName](accountAddress, coOwnerAddress,
                verificatorAddress, verificationContractkey, sendConfig);
        });
        
        var verificationContractAddress;
        it(`Should return created ${columnName} verification contract by key ${verificationContractkey}`, async () => {
            let verificationContractFactory = await VerificationContractFactory.deployed();
            verificationContractAddress =  await verificationContractFactory.getVerificationContract.call(verificationContractkey, sendConfig);
            assert.notEqual(verificationContractAddress, "0x0000000000000000000000000000000000000000");
        });

        it(`Should return column data and object type to owner.`, async () => {
            let verificationContract = await BaseVerification.at(verificationContractAddress);
            let data = await verificationContract.getData.call(sendConfig);
            
            let adapter = await AccountStorageAdapter.deployed();
            let accountData = await getAccountFieldLastMainData(adapter, accountAddress, columnName);
            assert.deepEqual(data, accountData);
        });
        
        it(`Should set verification ${columnName} result`, async () => {
            let verificationContract = await BaseVerification.at(verificationContractAddress);
            await verificationContract.setVerificationResult(true, sendConfig);
        });
        
        it(`Should get "verificationStatus". "verificationStatus" must be true`, async () => {
            let verificationContract = await BaseVerification.at(verificationContractAddress);
            let verificationStatus = await verificationContract.verificationStatus.call();
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
    
    it("Should unlock verificators accounts", async () => {
        web3.personal.unlockAccount(kimlicConfig.address, kimlicConfig.password);
        web3.personal.unlockAccount(veriffConfig.address, veriffConfig.password);
    });
    
    verificationTests("createEmailVerification", accountConsts.emailColumnName, kimlicConfig.address,
        verificatorAddress, uuidv4(), { "from": kimlicConfig.address });

    verificationTests("createPhoneVerification", accountConsts.phoneColumnName, kimlicConfig.address,
        verificatorAddress, uuidv4(), { "from": kimlicConfig.address });
    
    verificationTests("createDocumentVerification", accountConsts.documentsColumnName, kimlicConfig.address,
        verificatorAddress, uuidv4(), { "from": veriffConfig.address });
    
});
