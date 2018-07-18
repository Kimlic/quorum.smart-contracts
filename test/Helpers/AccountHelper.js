let accountConsts = {
    emailFieldName: "email",
    phoneFieldName: "phone",
    identityFieldName: "identity",
    deviceFieldName: "device",
    documentsFieldName: "documents.id_card",
    addressesFieldName: "addresses.living",
    emailValue: "email",
    phoneValue: "phone",
    identityValue: "identity",
    deviceValue: "device",
    documentValue: "documents",
    addressValue: "addresses",
}

let addAccountData = async function(adapter, address, fieldData, fieldName) {
    return adapter.setAccountFieldMainData(fieldData, fieldName, { from: address });
};

let getAccountFieldLastMainData = async function(adapter, address, fieldName) {
    return adapter.getAccountFieldLastMainData.call(address, fieldName, { from: address });
};

let getAccountFieldLastVerificationData = async function(adapter, address, fieldName) {
    return adapter.getAccountFieldLastVerificationData.call(address, fieldName, { from: address });
};


let getFieldDetails = async function(adapter, address, fieldName) {
    return adapter.getFieldDetails.call(address, fieldName, { from: address });
};

let getAccountLastDataIndex = async function(adapter, address, fieldName) {
    return adapter.getFieldHistoryLength.call(address, fieldName, { from: address });
};

module.exports = { accountConsts, addAccountData, getAccountFieldLastMainData,
        getAccountFieldLastVerificationData, getAccountLastDataIndex, getFieldDetails };