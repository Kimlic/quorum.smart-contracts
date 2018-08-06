
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

const getLastDataIndex = async (adapter, address, fieldName) => {
    return adapter.getFieldHistoryLength.call(address, fieldName);
};

let getFieldDetails = async function(adapter, address, fieldName) {
    return adapter.getFieldDetails.call(address, fieldName, { from: address });
};

module.exports = { addData, getFieldLastMainData, getFieldLastVerificationData, getLastDataIndex,
    getFieldDetails, getFieldLastVerificationAddress };
