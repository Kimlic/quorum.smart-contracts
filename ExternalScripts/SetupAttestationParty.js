const AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");

const { addData } = require("../test/Helpers/AccountHelper.js");
const { getNetworkDeployedConfig, deployedConfigPathConsts, saveDeployedConfig } = require("../deployedConfigHelper");
const { getValueByPath } = require("../commonLogic/commonLogic");


module.exports = async function(callback) {

    callback.call();
}