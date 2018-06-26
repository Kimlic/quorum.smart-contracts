/*jshint esversion: 6 */
let AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");

let { accountConsts, addAccountData, getAccountFieldLastMainData, getAccountLastDataIndex } = require("./Helpers/AccountHelper.js")


contract("AccountStorageAdapter", function(accounts) {
    let accountAddress = accounts[0];
    console.log(`accountAddress: ${accountAddress}`);

    
    let checkSetAccountData = (fieldData, columnName, expectedFieldIndex) => {
        let addDataCaption = `Should add account data. Set account ${columnName} = "${fieldData}".`;
        
        let readDataCaption = `Should read account ${columnName} data. Must be equal to "${fieldData}".`;
        
        let dataIndexCaption = `Should read account ${columnName} data index. Expected field index: ${expectedFieldIndex}`;
        
        it(addDataCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            await addAccountData(adapter, accountAddress, fieldData, columnName);
        });

        it(readDataCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            let data = await getAccountFieldLastMainData(adapter, accountAddress, columnName);
            assert.equal(data, fieldData);
        });
        
        it(dataIndexCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            let newDataIndex = await getAccountLastDataIndex(adapter, accountAddress, columnName);
            assert.equal(newDataIndex, expectedFieldIndex);
        });
    };
    
    checkSetAccountData(accountConsts.identityValue, accountConsts.identityColumnName, 1);
    checkSetAccountData(accountConsts.identityValue + "2", accountConsts.identityColumnName, 2);
    
    checkSetAccountData(accountConsts.emailValue, accountConsts.emailColumnName, 1);
    checkSetAccountData(accountConsts.emailValue + "2", accountConsts.emailColumnName, 2);
    
    checkSetAccountData(accountConsts.phoneValue, accountConsts.phoneColumnName, 1);
    checkSetAccountData(accountConsts.phoneValue + "2", accountConsts.phoneColumnName, 2);
    
    checkSetAccountData(accountConsts.deviceValue, accountConsts.deviceColumnName, 1);
    
    checkSetAccountData(accountConsts.addressValue, accountConsts.addressesColumnName, 1);
    checkSetAccountData(accountConsts.addressValue + "2", accountConsts.addressesColumnName, 2);
    
    checkSetAccountData(accountConsts.documentValue, accountConsts.documentsColumnName, 1);
    checkSetAccountData(accountConsts.documentValue + "2", accountConsts.documentsColumnName, 2);
});
