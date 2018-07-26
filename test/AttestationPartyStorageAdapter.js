const AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");

const basePartyStorageAdapterHelper = require("./Helpers/BasePartyStorageAdapterHelper.js");



contract("AttestationPartyStorageAdapter", function() {
    const getAdapter = async () => {
        return await AttestationPartyStorageAdapter.deployed();
    };
    
    const values = basePartyStorageAdapterHelper.basePartyConsts;
    basePartyStorageAdapterHelper.baseStorageAdapterTest(getAdapter, values);

    const keys =  Object.keys(values);
    for(let i = 0; i<keys.length; i++){ 
        values[keys[i]] += "2";
    }

    basePartyStorageAdapterHelper.baseStorageAdapterTest(getAdapter, values);
});