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
    metaDataColumnIndex: 0,
    emailColumnIndex: 0,
    phoneColumnIndex: 1,
    identityColumnIndex: 2,
    deviceColumnIndex: 3,
    documentsColumnIndex: 4,
    addressesColumnIndex: 5,
}

let addAccount = async function(adapter, fieldData, columnIndex) {
    return adapter.setAccountFieldMainData(fieldData, columnIndex);
};

let getAccountLastData = async function(adapter, address, columnIndex) {
    return adapter.getLastAccountData.call(address, columnIndex);
};

let getAccountLastDataIndex = async function(adapter, address, columnIndex) {
    return adapter.getFieldHistoryLength.call(address, columnIndex);
};

module.exports = { accountConsts, addAccount, getAccountLastData, getAccountLastDataIndex };