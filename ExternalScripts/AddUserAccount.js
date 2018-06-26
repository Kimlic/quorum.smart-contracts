let AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
let { accountConsts, addAccountData} = require("../test/Helpers/AccountHelper.js");

var fs = require("fs");

module.exports = async function(callback) {

    let adapter = await AccountStorageAdapter.deployed();
    let password = "p@ssw0rd";
    let address = web3.personal.newAccount(password);
    console.log(`Created new account address: "${address}", password: "${password}"`);
    web3.personal.unlockAccount(address, password);
    console.log("Account unlocked");

    await addAccountData(adapter, address, accountConsts.phoneValue, accountConsts.phoneObjectType, accountConsts.phoneColumnIndex);
    await addAccountData(adapter, address, accountConsts.emailValue, accountConsts.emailObjectType, accountConsts.emailColumnIndex);
    await addAccountData(adapter, address, accountConsts.identityValue, accountConsts.identityObjectType, accountConsts.identityColumnIndex);
    await addAccountData(adapter, address, accountConsts.documentValue, accountConsts.documentObjectType, accountConsts.documentsColumnIndex);
    await addAccountData(adapter, address, accountConsts.addressValue, accountConsts.addressObjectType, accountConsts.addressesColumnIndex);

    console.log("Saving to file");
    let createdUsersFileName = "CreatedUsers.json";
    let createdUsers = [];
    if(fs.existsSync(createdUsersFileName)) {
        createdUsers = JSON.parse(fs.readFileSync(createdUsersFileName)) || [];
    }
    createdUsers.push({address: address, password: password});
    fs.writeFileSync(createdUsersFileName, JSON.stringify(createdUsers));
    callback.call();
}