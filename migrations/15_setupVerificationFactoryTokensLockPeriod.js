/*jshint esversion: 6 */
const VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");

const { getFormatedConsoleLabel, setValueByPath, getValueByPath, combinePath } = require("../commonLogic/commonLogic");
const { getNetworkDeployedConfig, deployedConfigPathConsts, saveDeployedConfig } = require("../deployedConfigHelper");

module.exports = function(deployer) {
    console.log(getFormatedConsoleLabel("Setup verification contract factory tokens lock period:"));

    deployer.then(async () => {
        const deployedConfig = getNetworkDeployedConfig(web3.version.network);

        const configPath = deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path;
        const accountFields = getValueByPath(deployedConfig, configPath);
        const tokensLockPeriod = {
            "email": 5,
            "phone": 2,
            "documents.id_card": 30,
            "documents.passport": 30,
            "documents.driver_license": 30,
            "documents.residence_permit_card": 30,
            "addresses.billing": 30,
            "addresses.living": 30
        };

        const verificationContractFactoryInstance = await VerificationContractFactory.deployed();

        for(const fieldName of accountFields) {
            if (fieldName == "device") {
                return;
            }

            const lockPeriod = tokensLockPeriod[fieldName];
            console.log(`${fieldName} lock period: ${lockPeriod}`);
            verificationContractFactoryInstance.setTokensLockPeriod(fieldName, lockPeriod);

            const path = deployedConfigPathConsts.verificationContractFactory.accountField.tokensLockPeriod.pathTemplate;
            const configPath = combinePath(path, { accountField: fieldName });
            setValueByPath(deployedConfig, configPath, lockPeriod);
            saveDeployedConfig();
        }
    });
};
