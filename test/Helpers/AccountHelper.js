let accountConsts = {
    emailColumnName: "email",
    phoneColumnName: "phone",
    identityColumnName: "identity",
    deviceColumnName: "device",
    documentsColumnName: "documents",
    addressesColumnName: "addresses",
    emailValue: "email",
    phoneValue: "phone",
    identityValue: "identity",
    deviceValue: "device",
    documentValue: "documents",
    addressValue: "addresses",
    emailObjectType: "Main email",
    phoneObjectType: "Main phone",
    identityObjectType: "identity",
    deviceObjectType: "deviceId",
    documentObjectType: "id",
    addressObjectType: "living address",
    metaDataColumnIndex: 0,
    emailColumnIndex: 0,
    phoneColumnIndex: 1,
    identityColumnIndex: 2,
    deviceColumnIndex: 3,
    documentsColumnIndex: 4,
    addressesColumnIndex: 5,
}

let addAccount = async function(adapter, fieldData, objectType, columnNameIndex) {
    return adapter.setAccountFieldMainData(fieldData, objectType, columnNameIndex);
};

let getAccountFieldLastMainData = async function(adapter, address, columnNameIndex) {
    return adapter.getAccountFieldLastMainData.call(address, columnNameIndex);
};

let getAccountLastDataIndex = async function(adapter, address, columnNameIndex) {
    return adapter.getFieldHistoryLength.call(address, columnNameIndex);
};

module.exports = { accountConsts, addAccount, getAccountFieldLastMainData, getAccountLastDataIndex };