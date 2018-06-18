let AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");

let basePartyStorageAdapterHelper = require("./Helpers/BasePartyStorageAdapterHelper.js")



contract("Verification", function(accounts) {
    let getAdapter = async () => {
        return await AttestationPartyStorageAdapter.deployed();
    };
    
    let values = basePartyStorageAdapterHelper.basePartyConsts;
    basePartyStorageAdapterHelper.baseStorageAdapterTest(getAdapter, accounts[0], values);

    let keys =  Object.keys(values);
    for(let i = 0; i<keys.length; i++){ 
        values[keys[i]] += "2";
    }

    basePartyStorageAdapterHelper.baseStorageAdapterTest(getAdapter, accounts[0], values);
});