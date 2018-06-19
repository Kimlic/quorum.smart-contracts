let RelyingPartyStorageAdapter = artifacts.require("./RelyingPartyStorageAdapter.sol");

let basePartyStorageAdapterHelper = require("./Helpers/BasePartyStorageAdapterHelper.js")



contract("RelyingPartyStorageAdapter", function(accounts) {
    let getAdapter = async () => {
        return await RelyingPartyStorageAdapter.deployed();
    };
    
    let values = basePartyStorageAdapterHelper.basePartyConsts;
    basePartyStorageAdapterHelper.baseStorageAdapterTest(getAdapter, accounts[0], values);

    let keys =  Object.keys(values);
    for(let i = 0; i<keys.length; i++){ 
        values[keys[i]] += "2";
    }

    basePartyStorageAdapterHelper.baseStorageAdapterTest(getAdapter, accounts[0], values);
});