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
}

let addAccount = async function(adapter, fieldData, objectType, columnName) {
    return adapter.setAccountFieldMainData(fieldData, objectType, columnName);
};

let getAccountFieldLastMainData = async function(adapter, address, columnName) {
    return adapter.getAccountFieldLastMainData.call(address, columnName);
};

let getAccountFieldLastVerificationData = async function(adapter, address, columnName) {
    return adapter.getAccountFieldLastVerificationData.call(address, columnName);
};

let getAccountLastDataIndex = async function(adapter, address, columnName) {
    return adapter.getFieldHistoryLength.call(address, columnName);
};

module.exports = { accountConsts, addAccount, getAccountFieldLastMainData, getAccountFieldLastVerificationData, getAccountLastDataIndex };