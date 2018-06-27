let accountConsts = {
    emailColumnName: "email",
    phoneColumnName: "phone",
    identityColumnName: "identity",
    deviceColumnName: "device",
    documentsColumnName: "documents.id_card",
    addressesColumnName: "addresses.living",
    emailValue: "email",
    phoneValue: "phone",
    identityValue: "identity",
    deviceValue: "device",
    documentValue: "documents",
    addressValue: "addresses",
}

let addAccountData = async function(adapter, address, fieldData, columnName) {
    return adapter.setAccountFieldMainData(fieldData, columnName, { from: address });
};

let getAccountFieldLastMainData = async function(adapter, address, columnName) {
    return adapter.getAccountFieldLastMainData.call(address, columnName, { from: address });
};

let getAccountFieldLastVerificationData = async function(adapter, address, columnName) {
    return adapter.getAccountFieldLastVerificationData.call(address, columnName, { from: address });
};

let getAccountLastDataIndex = async function(adapter, address, columnName) {
    return adapter.getFieldHistoryLength.call(address, columnName, { from: address });
};

module.exports = { accountConsts, addAccountData, getAccountFieldLastMainData, getAccountFieldLastVerificationData, getAccountLastDataIndex };