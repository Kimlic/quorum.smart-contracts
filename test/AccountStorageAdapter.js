/*jshint esversion: 6 */
let AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");

let { accountConsts, addAccountData, getAccountFieldLastMainData, getAccountLastDataIndex } = require("./Helpers/AccountHelper.js")


contract("AccountStorageAdapter", function(accounts) {
    let accountAddress = accounts[0];
    console.log(`accountAddress: ${accountAddress}`);

    
    let checkSetAccountField = (fieldData, fieldName, expectedFieldIndex) => {
        let addDataCaption = `Should add account data. Set account ${fieldName} = "${fieldData}".`;
        
        let readDataCaption = `Should read account ${fieldName} data. Must be equal to "${fieldData}".`;
        
        let dataIndexCaption = `Should read account ${fieldName} data index. Expected field index: ${expectedFieldIndex}`;
        
        it(addDataCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            await addAccountData(adapter, accountAddress, fieldData, fieldName);
        });

        it(readDataCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            let data = await getAccountFieldLastMainData(adapter, accountAddress, fieldName);
            assert.equal(data, fieldData);
        });
        
        it(dataIndexCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            let newDataIndex = await getAccountLastDataIndex(adapter, accountAddress, fieldName);
            assert.equal(newDataIndex, expectedFieldIndex);
        });
    };
    
    checkSetAccountField(accountConsts.identityValue, accountConsts.identityFieldName, 1);
    checkSetAccountField(accountConsts.identityValue + "2", accountConsts.identityFieldName, 2);
    
    checkSetAccountField(accountConsts.emailValue, accountConsts.emailFieldName, 1);
    checkSetAccountField(accountConsts.emailValue + "2", accountConsts.emailFieldName, 2);
    
    checkSetAccountField(accountConsts.phoneValue, accountConsts.phoneFieldName, 1);
    checkSetAccountField(accountConsts.phoneValue + "2", accountConsts.phoneFieldName, 2);
    
    checkSetAccountField(accountConsts.deviceValue, accountConsts.deviceFieldName, 1);
    
    checkSetAccountField(accountConsts.addressValue, accountConsts.addressesFieldName, 1);
    checkSetAccountField(accountConsts.addressValue + "2", accountConsts.addressesFieldName, 2);
    
    checkSetAccountField(accountConsts.documentValue, accountConsts.documentsFieldName, 1);
    checkSetAccountField(accountConsts.documentValue + "2", accountConsts.documentsFieldName, 2);
});
