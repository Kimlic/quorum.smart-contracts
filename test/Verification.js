/*jshint esversion: 6 *//*jshint esversion: 6 */
let VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
let BaseVerification = artifacts.require("./BaseVerification.sol");
let AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
let KimlicToken = artifacts.require("./KimlicToken.sol");

let { accountConsts, addAccount, getAccountLastData, getAccountLastDataIndex } = require("./Helpers/AccountHelper.js")


contract("Verification", function(accounts) {
    
    let accountAddress = accounts[0];
    
    it("init account", async () => {
        let adapter = await AccountStorageAdapter.deployed();
        console.log(`phoneValue: ${accountConsts.phoneValue} , phoneColumnIndex: ${accountConsts.phoneColumnIndex}`);
        await addAccount(adapter, accountConsts.phoneValue, accountConsts.phoneColumnIndex);
        await addAccount(adapter, accountConsts.emailValue, accountConsts.emailColumnIndex);
        //await addAccount(adapter, accountConsts.identityValue, accountConsts.identityColumnIndex);
        await addAccount(adapter, accountConsts.documentValue, accountConsts.documentsColumnIndex);
        //await addAccount(adapter, accountConsts.addressValue, accountConsts.addressesColumnIndex);
    });

    it("allow verification contract factory to spend coOwner`s tokens", async () => {
        let adapter = await AccountStorageAdapter.deployed();
        let verificationContractFactory = await VerificationContractFactory.deployed();
        let kimlicToken = await KimlicToken.deployed();
        await kimlicToken.approve(verificationContractFactory.address, 1000000);
    })

    let verificationTests = (factoryMethodName, columnName, columnIndex, coOwnerAddress, verificatorAddress, verificationContractkey) => {
        it(`Shold create ${columnName} verification contract`, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            let verificationContractFactory = await VerificationContractFactory.deployed();
            let lastDataIndex = await getAccountLastDataIndex(adapter, accountAddress, columnIndex);
            await verificationContractFactory[factoryMethodName](accountAddress, coOwnerAddress,
                lastDataIndex, verificatorAddress, verificationContractkey);
        });
        
        var verificationContractAddress;
        it(`Shold return created ${columnName} verification contract by key`, async () => {
            let verificationContractFactory = await VerificationContractFactory.deployed();
            verificationContractAddress =  await verificationContractFactory.getVerificationContract.call(verificationContractkey);
            assert.notEqual(verificationContractAddress, "0x0000000000000000000000000000000000000000");
        });
        
        it(`Shold set verification ${columnName} result`, async () => {
            let verificationContractFactory = await BaseVerification.at(verificationContractAddress);
            await verificationContractFactory.setVerificationResult(true);
        });
    }

    let verificationContractkey = "test";
    let coOwnerAddress = accounts[0];//TODO replace by real co owner address;
    let verificatorAddress = accounts[0];//TODO replace by real co verificator address;
    
    verificationTests("createEmailVerification", accountConsts.emailColumnName, accountConsts.emailColumnIndex,
        coOwnerAddress, verificatorAddress, verificationContractkey);

    verificationTests("createPhoneVerification", accountConsts.phoneColumnName, accountConsts.phoneColumnIndex,
        coOwnerAddress, verificatorAddress, verificationContractkey);
    
    verificationTests("createDocumentVerification", accountConsts.documentsColumnName, accountConsts.documentsColumnIndex,
        coOwnerAddress, verificatorAddress, verificationContractkey);
});
