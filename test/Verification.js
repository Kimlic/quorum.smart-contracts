/*jshint esversion: 6 *//*jshint esversion: 6 */
var fs = require("fs");

let VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
let BaseVerification = artifacts.require("./BaseVerification.sol");
let AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
let KimlicToken = artifacts.require("./KimlicToken.sol");

let { accountConsts, addAccount, getAccountLastData, getAccountLastDataIndex } = require("./Helpers/AccountHelper.js")


contract("Verification", function(accounts) {
    
    let accountAddress = accounts[0];

    it("init account", async () => {
        let adapter = await AccountStorageAdapter.deployed();
        await addAccount(adapter, accountConsts.phoneValue, accountConsts.phoneObjectType, accountConsts.phoneColumnIndex);
        await addAccount(adapter, accountConsts.emailValue, accountConsts.emailObjectType, accountConsts.emailColumnIndex);
        //await addAccount(adapter, accountConsts.identityValue, accountConsts.identityObjectType, accountConsts.identityColumnIndex);
        await addAccount(adapter, accountConsts.documentValue, accountConsts.documentObjectType, accountConsts.documentsColumnIndex);
        //await addAccount(adapter, accountConsts.addressValue, accountConsts.addressObjectType, accountConsts.addressesColumnIndex);
    });

    it("allow verification contract factory to spend coOwner`s tokens", async () => {
        let adapter = await AccountStorageAdapter.deployed();
        let verificationContractFactory = await VerificationContractFactory.deployed();
        let kimlicToken = await KimlicToken.deployed();
        await kimlicToken.approve(verificationContractFactory.address, 1000000);
    })

    let verificationTests = (factoryMethodName, columnName, columnIndex, coOwnerAddress, verificatorAddress,
            verificationContractkey, sendConfig) => {
        it(`Should create ${columnName} verification contract`, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            let verificationContractFactory = await VerificationContractFactory.deployed();
            let lastDataIndex = await getAccountLastDataIndex(adapter, accountAddress, columnIndex);
            await verificationContractFactory[factoryMethodName](accountAddress, coOwnerAddress,
                lastDataIndex, verificatorAddress, verificationContractkey, sendConfig);
        });
        
        var verificationContractAddress;
        it(`Should return created ${columnName} verification contract by key ${verificationContractkey}`, async () => {
            let verificationContractFactory = await VerificationContractFactory.deployed();
            verificationContractAddress =  await verificationContractFactory.getVerificationContract.call(verificationContractkey, sendConfig);
            assert.notEqual(verificationContractAddress, "0x0000000000000000000000000000000000000000");
        });
        
        it(`Should set verification ${columnName} result`, async () => {
            let verificationContractFactory = await BaseVerification.at(verificationContractAddress);
            await verificationContractFactory.setVerificationResult(true, sendConfig);
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

    let verificatorAddress = accounts[0];//TODO replace by real co verificator address;

    let config = getPartiesConfig();
    let kimlicConfig = config["Kimlic"];
    let veriffConfig = config["Veriff"];
    
    it("Should unlock verificators accounts", async () => {
        web3.personal.unlockAccount(kimlicConfig.address, kimlicConfig.password);
        web3.personal.unlockAccount(veriffConfig.address, veriffConfig.password);
    });
    
    verificationTests("createEmailVerification", accountConsts.emailColumnName, accountConsts.emailColumnIndex,
        kimlicConfig.address, verificatorAddress, uuidv4(), { "from": kimlicConfig.address });

    verificationTests("createPhoneVerification", accountConsts.phoneColumnName, accountConsts.phoneColumnIndex,
        kimlicConfig.address, verificatorAddress, uuidv4(), { "from": kimlicConfig.address });
    
    verificationTests("createDocumentVerification", accountConsts.documentsColumnName, accountConsts.documentsColumnIndex,
        kimlicConfig.address, verificatorAddress, uuidv4(), { "from": veriffConfig.address });
    
});
