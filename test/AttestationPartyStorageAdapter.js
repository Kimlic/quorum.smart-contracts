const AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");

const basePartyStorageAdapterHelper = require("./Helpers/BasePartyStorageAdapterHelper.js");



contract("AttestationPartyStorageAdapter", function() {
    const getAdapter = async () => {
        return await AttestationPartyStorageAdapter.deployed();
    };
    
    const values = basePartyStorageAdapterHelper.basePartyConsts;
    basePartyStorageAdapterHelper.baseStorageAdapterTest(getAdapter, values);

    const newValues = {};
    const keys =  Object.keys(values);
    for(let i = 0; i<keys.length; i++){
        const key = keys[i];
        newValues[key] = values[key] += "2";
    }

    basePartyStorageAdapterHelper.baseStorageAdapterTest(getAdapter, newValues);
});