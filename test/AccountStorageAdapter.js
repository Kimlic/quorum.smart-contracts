/*jshint esversion: 6 */
let AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");

let { accountConsts, addAccount, getAccountLastData, getAccountLastDataIndex } = require("./Helpers/AccountHelper.js")


contract("AccountStorageAdapter", function(accounts) {
    
    console.log("accountAddress: " + accounts[0]);

    
    let checkSetAccountData = (fieldData, columnIndex, columnName, expectedFieldIndex) => {
        let addDataCaption = `Shold add account data. Set account ${columnName} = "${fieldData}".`;
        
        let readDataCaption = `Shold read account ${columnName} data. Must be equal to "${fieldData}".`;
        
        let dataIndexCaption = `Shold read account ${columnName} data index. Expected field index: ${expectedFieldIndex}`;
        
        it(addDataCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            await addAccount(adapter, fieldData, columnIndex);
        });

        it(readDataCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            let data = await getAccountLastData(adapter, accounts[0], columnIndex);
            assert.equal(data[accountConsts.metaDataColumnIndex], fieldData);
        });
        
        it(dataIndexCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            let newDataIndex = await getAccountLastDataIndex(adapter, accounts[0], columnIndex);
            assert.equal(newDataIndex, expectedFieldIndex);
        });
    };

    checkSetAccountData(accountConsts.identityValue, accountConsts.identityColumnIndex, 
        accountConsts.identityColumnName, 1);
    checkSetAccountData(accountConsts.identityValue + "2", accountConsts.identityColumnIndex, 
        accountConsts.identityColumnName, 2);
    
    checkSetAccountData(accountConsts.emailValue, accountConsts.emailColumnIndex, 
        accountConsts.emailColumnName, 1);
    checkSetAccountData(accountConsts.emailValue + "2", accountConsts.emailColumnIndex, 
    accountConsts.emailColumnName, 2);
    
    checkSetAccountData(accountConsts.phoneValue, accountConsts.phoneColumnIndex, 
        accountConsts.phoneColumnName, 1);
    checkSetAccountData(accountConsts.phoneValue + "2", accountConsts.phoneColumnIndex, 
        accountConsts.phoneColumnName, 2);
    
    checkSetAccountData(accountConsts.deviceValue, accountConsts.deviceColumnIndex, 
        accountConsts.deviceColumnName, 1);
    
    checkSetAccountData(accountConsts.addressValue, accountConsts.addressesColumnIndex, 
        accountConsts.addressesColumnName, 1);
    checkSetAccountData(accountConsts.addressValue + "2", accountConsts.addressesColumnIndex, 
    accountConsts.addressesColumnName, 2);
    
    checkSetAccountData(accountConsts.documentValue, accountConsts.documentsColumnIndex, 
        accountConsts.documentsColumnName, 1);
    checkSetAccountData(accountConsts.documentValue + "2", accountConsts.documentsColumnIndex, 
    accountConsts.documentsColumnName, 2);
});
