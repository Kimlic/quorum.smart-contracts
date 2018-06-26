/*jshint esversion: 6 */
let AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");

let { accountConsts, addAccountData, getAccountFieldLastMainData, getAccountLastDataIndex } = require("./Helpers/AccountHelper.js")


contract("AccountStorageAdapter", function(accounts) {
    
    console.log("accountAddress: " + accounts[0]);

    
    let checkSetAccountData = (fieldData, fieldObjectType, columnNameIndex, columnName, expectedFieldIndex) => {
        let addDataCaption = `Should add account data. Set account ${columnName} = "${fieldData}".`;
        
        let readDataCaption = `Should read account ${columnName} data. Must be equal to "${fieldData}".`;
        
        let dataIndexCaption = `Should read account ${columnName} data index. Expected field index: ${expectedFieldIndex}`;
        
        it(addDataCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            await addAccountData(adapter, accounts[0], fieldData, fieldObjectType, columnNameIndex);
        });

        it(readDataCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            let data = await getAccountFieldLastMainData(adapter, accounts[0], columnNameIndex);
            assert.equal(data[accountConsts.metaDataColumnIndex], fieldData);
        });
        
        it(dataIndexCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            let newDataIndex = await getAccountLastDataIndex(adapter, accounts[0], columnNameIndex);
            assert.equal(newDataIndex, expectedFieldIndex);
        });
    };

    
    checkSetAccountData(accountConsts.identityValue, accountConsts.identityObjectType, accountConsts.identityColumnIndex, 
        accountConsts.identityColumnName, 1);
    checkSetAccountData(accountConsts.identityValue + "2", accountConsts.identityObjectType, accountConsts.identityColumnIndex, 
        accountConsts.identityColumnName, 2);
    
    checkSetAccountData(accountConsts.emailValue, accountConsts.emailObjectType, accountConsts.emailColumnIndex, 
        accountConsts.emailColumnName, 1);
    checkSetAccountData(accountConsts.emailValue + "2", accountConsts.emailObjectType, accountConsts.emailColumnIndex, 
    accountConsts.emailColumnName, 2);
    
    checkSetAccountData(accountConsts.phoneValue, accountConsts.phoneObjectType, accountConsts.phoneColumnIndex, 
        accountConsts.phoneColumnName, 1);
    checkSetAccountData(accountConsts.phoneValue + "2", accountConsts.phoneObjectType, accountConsts.phoneColumnIndex, 
        accountConsts.phoneColumnName, 2);
    
    checkSetAccountData(accountConsts.deviceValue, accountConsts.deviceObjectType, accountConsts.deviceColumnIndex, 
        accountConsts.deviceColumnName, 1);
    
    checkSetAccountData(accountConsts.addressValue, accountConsts.addressObjectType, accountConsts.addressesColumnIndex, 
        accountConsts.addressesColumnName, 1);
    checkSetAccountData(accountConsts.addressValue + "2", accountConsts.addressObjectType, accountConsts.addressesColumnIndex, 
    accountConsts.addressesColumnName, 2);
    
    checkSetAccountData(accountConsts.documentValue, accountConsts.documentObjectType, accountConsts.documentsColumnIndex, 
        accountConsts.documentsColumnName, 1);
    checkSetAccountData(accountConsts.documentValue + "2", accountConsts.documentObjectType, accountConsts.documentsColumnIndex, 
    accountConsts.documentsColumnName, 2);
});
