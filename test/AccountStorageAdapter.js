var AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");


contract("AccountStorageAdapter", function(accounts){
    var adapter;
    const emailHash = "emailHash";
    const phoneHash = "phoneHash";
    const identityHash = "identityHash";
    const metaDataColumnIndex = 0;
    const emailColumnIndex = 0;
    const phoneColumnIndex = 1;
    const identityColumnIndex = 2;

    it("Check first set account data", function() {
        console.log("accountAddress: " + accounts[0]);
        return AccountStorageAdapter.deployed().then(function(adapterInstance){
            adapter = adapterInstance;
            return adapter.setAccountData(identityHash, phoneHash, emailHash, "0x01");
        }).then(function () {
            return adapter.getLastAccountData.call(accounts[0], emailColumnIndex)
        }).then(function (data) {
            assert.equal(data[metaDataColumnIndex], emailHash);

            return adapter.getLastAccountData.call(accounts[0], phoneColumnIndex);
        }).then(function (data) {
            assert.equal(data[metaDataColumnIndex], phoneHash);

            return adapter.getLastAccountData.call(accounts[0], identityColumnIndex);
        }).then(function (data) {
            assert.equal(data[metaDataColumnIndex], identityHash);
            return adapter.getFieldHistoryLength.call(accounts[0], identityColumnIndex);
        }).then(function (data) {
            assert.equal(data, 1);
        });
    });

    const secondaryIdentityHash = identityHash + "2";
    it("Check secondary set account data", function() {
        console.log("accountAddress: " + accounts[0]);
        return AccountStorageAdapter.deployed().then(function(adapterInstance){
            adapter = adapterInstance;
            return adapter.setAccountData(secondaryIdentityHash, phoneHash, emailHash, "0x01");
        }).then(function (data) {
            return adapter.getLastAccountData.call(accounts[0], identityColumnIndex);
        }).then(function (data) {
            assert.equal(data[metaDataColumnIndex], secondaryIdentityHash);
            return adapter.getFieldHistoryLength.call(accounts[0], identityColumnIndex);
        }).then(function (data) {
            assert.equal(data, 2);
            return adapter.getFieldHistoryLength.call(accounts[0], emailColumnIndex);
        }).then(function (data) {
            assert.equal(data, 1);
        });
    });
});
