
const addData = async (adapter, fieldData, fieldName, fromAddress) => {
    return adapter.setFieldMainData(fieldData, fieldName, { from: fromAddress });
};

const getFieldLastMainData = async (adapter, address, fieldName, fromAddress) => {
    return adapter.getFieldLastMainData.call(address, fieldName, { from: fromAddress });
};

const getFieldLastVerificationData = async (adapter, address, fieldName, fromAddress) => {
    return adapter.getFieldLastVerificationData.call(address, fieldName, { from: fromAddress });
};

const getFieldLastVerificationAddress = async (adapter, address, fieldName, fromAddress) => {
    return adapter.getFieldLastVerificationAddress.call(address, fieldName, { from: fromAddress });
};

const getLastDataIndex = async (adapter, address, fieldName, fromAddress) => {
    return adapter.getFieldHistoryLength.call(address, fieldName, { from: fromAddress });
};

let getFieldDetails = async function(adapter, address, fieldName) {
    return adapter.getFieldDetails.call(address, fieldName, { from: address });
};

const createAccountAndSet1EthToBalance = async (web3) => {
    const accountPassword = "p@ssw0rd";
    const accountAddress = await web3.personal.newAccount(accountPassword);
    await web3.personal.unlockAccount(accountAddress, accountPassword, 1000);
    await web3.eth.sendTransaction({"from": web3.eth.coinbase, "to": accountAddress, "value": 1000000000000000000});//1 eth
    return { accountAddress, accountPassword };
}

module.exports = { addData, getFieldLastMainData, getFieldLastVerificationData, getLastDataIndex,
    createAccountAndSet1EthToBalance, getFieldDetails, getFieldLastVerificationAddress };
