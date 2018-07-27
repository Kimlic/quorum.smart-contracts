/*jshint esversion: 6 */
const AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");

const { addData, getFieldLastMainData, createAccountAndSet1EthToBalance, getFieldDetails } = require("./Helpers/AccountHelper.js");
const { getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { getValueByPath } = require("../commonLogic");



contract("AccountStorageAdapter.Negative", function() {
    let accountAddress = "";
    let secondAccountAddress = "";
    before("create account", async () => {
        const account = await createAccountAndSet1EthToBalance(web3);
        accountAddress = account.accountAddress;
        console.log(`accountAddress: ${accountAddress}`);
        const secondAccount = await createAccountAndSet1EthToBalance(web3);
        secondAccountAddress = secondAccount.accountAddress;
        console.log(`second account address: ${secondAccountAddress}`);
    });
    
    const checkSetAccountField = (fieldData, fieldName) => {
        before(`Should add account data. Set account ${fieldName} = "${fieldData}".`, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            await addData(adapter, fieldData, fieldName, accountAddress);
        });

        it(`Should not read account ${fieldName} data from other account.`, async () => {
            let adapter = await AccountStorageAdapter.deployed();
            try {
                await getFieldLastMainData(adapter, secondAccountAddress, fieldName, accountAddress);
            } catch (error) {
                return;
            }
            assert.fail('Expected throw not received');
        });
        
        it(`Should not read account ${fieldName} full data from other account`, async () => {
            const adapter = await AccountStorageAdapter.deployed();
            const details = await getFieldDetails(adapter, secondAccountAddress, fieldName, accountAddress);
            assert.equal(details[0], "");
        });
    };
    
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);

    const allowedFieldNamesConfigPath = deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path;
    const allowedFieldNamesConfig = getValueByPath(deployedConfig, allowedFieldNamesConfigPath);

    allowedFieldNamesConfig.forEach(fieldName => {
        if (fieldName != "device") {
            checkSetAccountField(fieldName, fieldName);
        }
    });
});
