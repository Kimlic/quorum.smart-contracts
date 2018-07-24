const accountConsts = {
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

const addAccountData = async (adapter, address, fieldData, fieldName) => {
    return adapter.setFieldMainData(fieldData, fieldName, { from: address });
};

const getAccountFieldLastMainData = async (adapter, address, fieldName) => {
    return adapter.getFieldLastMainData.call(address, fieldName, { from: address });
};

const getAccountFieldLastVerificationData = async (adapter, address, fieldName) => {
    return adapter.getFieldLastVerificationData.call(address, fieldName, { from: address });
};

const getAccountLastDataIndex = async (adapter, address, fieldName) => {
    return adapter.getFieldHistoryLength.call(address, fieldName, { from: address });
};

const createAccountAndSet1EthToBalance = async (web3) => {
    const accountPassword = "p@ssw0rd";
    const accountAddress = await web3.personal.newAccount(accountPassword);
    await web3.personal.unlockAccount(accountAddress, accountPassword, 1000);
    await web3.eth.sendTransaction({"from": web3.eth.coinbase, "to": accountAddress, "value": 1000000000000000000});//1 eth
    return { accountAddress, accountPassword };
}

module.exports = { accountConsts, addAccountData, getAccountFieldLastMainData,
    getAccountFieldLastVerificationData, getAccountLastDataIndex, createAccountAndSet1EthToBalance };