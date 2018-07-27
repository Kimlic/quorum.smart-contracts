/*jshint esversion: 6 */
const AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");

const { addData, getFieldLastMainData, getLastDataIndex, createAccountAndSet1EthToBalance, getFieldDetails } = require("./Helpers/AccountHelper.js");
const { getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { getValueByPath } = require("../commonLogic");



contract("AccountStorageAdapter", function() {
    let accountAddress = "";
    it("create account", async () => {
        const account = await createAccountAndSet1EthToBalance(web3);
        accountAddress = account.accountAddress;
        console.log(`accountAddress: ${accountAddress}`);
    });
    
    let checkSetAccountField = (fieldData, fieldName, expectedFieldIndex) => {
        let addDataCaption = `Should add account data. Set account ${fieldName} = "${fieldData}".`;
        
        let readDataCaption = `Should read account ${fieldName} data. Must be equal to "${fieldData}".`;
        
        let dataIndexCaption = `Should read account ${fieldName} data index. Expected field index: ${expectedFieldIndex}`;
        
        it(addDataCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            await addData(adapter, fieldData, fieldName, accountAddress);
        });

        it(readDataCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            let data = await getFieldLastMainData(adapter, accountAddress, fieldName, accountAddress);
            assert.equal(data, fieldData);
        });
        
        it(dataIndexCaption, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            let newDataIndex = await getLastDataIndex(adapter, accountAddress, fieldName, accountAddress);
            assert.equal(newDataIndex, expectedFieldIndex);
        });
        it(`Should read account ${fieldName} full data`, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            await getFieldDetails(adapter, accountAddress, fieldName, accountAddress);
        });
    };
    
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);

    const allowedFieldNamesConfigPath = deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path;
    const allowedFieldNamesConfig = getValueByPath(deployedConfig, allowedFieldNamesConfigPath);

    allowedFieldNamesConfig.forEach(fieldName => {
        if (fieldName != "device") {
            checkSetAccountField(fieldName, fieldName, 1);
            checkSetAccountField(fieldName + "2", fieldName, 2);
        }
    });
});
