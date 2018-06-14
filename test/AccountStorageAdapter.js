/*jshint esversion: 6 */
var AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");


contract("AccountStorageAdapter", function(accounts) {
    var adapter;
    const emailColumnName = "email";
    const phoneColumnName = "phone";
    const identityColumnName = "identity";
    const deviceColumnName = "device";
    const documentsColumnName = "documents";
    const addressesColumnName = "addresses";
    const emailValue = "email";
    const phoneValue = "phone";
    const identityValue = "identity";
    const deviceValue = "device";
    const documentValue = "documents";
    const addressValue = "addresses";
    const metaDataColumnIndex = 0;
    const emailColumnIndex = 0;
    const phoneColumnIndex = 1;
    const identityColumnIndex = 2;
    const deviceColumnIndex = 3;
    const documentsColumnIndex = 4;
    const addressesColumnIndex = 5;
    
    console.log("accountAddress: " + accounts[0]);

    
    var checkSetAccountData = function(fieldData, columnIndex, columnName, expectedFieldIndex) {
        var addDataCaption = `Check adding account data. Set account ${columnName} = "${fieldData}".`;
        
        var readDataCaption = `Check reading account data. ${columnName} should be equal to "${fieldData}".`;
        
        var dataIndexCaption = `Check added account data index. Expected ${columnName} field index: ${expectedFieldIndex}`;
        
        it(addDataCaption, async () => {
            adapter = await AccountStorageAdapter.deployed();
            await adapter.setAccountData(fieldData, columnIndex);
        });

        it(readDataCaption, async () => {
            adapter = await AccountStorageAdapter.deployed();
            var data = await adapter.getLastAccountData.call(accounts[0], columnIndex);
            assert.equal(data[metaDataColumnIndex], fieldData);
        });
        
        it(dataIndexCaption, async () => {
            adapter = await AccountStorageAdapter.deployed();
            var newDataIndex = await adapter.getFieldHistoryLength.call(accounts[0], columnIndex);
            assert.equal(newDataIndex, expectedFieldIndex);
        });
    };

    checkSetAccountData(identityValue, identityColumnIndex, identityColumnName, 1);
    checkSetAccountData(identityValue + "2", identityColumnIndex, identityColumnName, 2);
    
    checkSetAccountData(emailValue, emailColumnIndex, emailColumnName, 1);
    checkSetAccountData(emailValue + "2", emailColumnIndex, emailColumnName, 2);
    
    checkSetAccountData(phoneValue, phoneColumnIndex, phoneColumnName, 1);
    checkSetAccountData(phoneValue + "2", phoneColumnIndex, phoneColumnName, 2);
    
    checkSetAccountData(deviceValue, deviceColumnIndex, deviceColumnName, 1);
    
    checkSetAccountData(addressValue, addressesColumnIndex, addressesColumnName, 1);
    checkSetAccountData(addressValue + "2", addressesColumnIndex, addressesColumnName, 2);
    
    checkSetAccountData(documentValue, documentsColumnIndex, documentsColumnName, 1);
    checkSetAccountData(documentValue + "2", documentsColumnIndex, documentsColumnName, 2);

    
    
});
