/*jshint esversion: 6 */
const AccountStorage = artifacts.require("./AccountStorage.sol");
const KimlicContextStorage = artifacts.require("./KimlicContextStorage.sol");
const KimlicContractsContext = artifacts.require("./KimlicContractsContext.sol");
const AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
const VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
const ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
const KimlicToken = artifacts.require("./KimlicToken.sol");
const RewardingContract = artifacts.require("./RewardingContract.sol");
const RelyingPartyStorageAdapter = artifacts.require("./RelyingPartyStorageAdapter.sol");
const RelyingPartyStorage = artifacts.require("./RelyingPartyStorage.sol");
const AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");
const AttestationPartyStorage = artifacts.require("./AttestationPartyStorage.sol");

const { getTransactionConfig, getFormatedConsoleLabel } = require("./Helpers/MigrationHelper");
const { loadDeployedConfigIntoCache, saveDeployedConfig, getNetworkDeployedConfig } = require("../deployedConfigHelper");
const { setValueByPath } = require("../commonLogic");


module.exports = function(deployer, network, accounts) {
    console.log(getFormatedConsoleLabel("deploy all contracts: "));
    let transactionConfig = getTransactionConfig(deployer, network, accounts);

    loadDeployedConfigIntoCache();
    var deployedConfig = getNetworkDeployedConfig(network);

    deployer.then(async () => {
        await deployer.deploy(KimlicContextStorage, transactionConfig);
        console.log(`KimlicContextStorage deployed at address ${KimlicContextStorage.address}`);
        setValueByPath(deployedConfig, "deployedContracts.kimlicContextStorageAddress", KimlicContextStorage.address);

        await deployer.deploy(KimlicContractsContext, KimlicContextStorage.address, transactionConfig);
        console.log(`KimlicContractsContext deployed at address ${KimlicContractsContext.address}`);
        setValueByPath(deployedConfig, "deployedContracts.kimlicContractsContextAddress", KimlicContractsContext.address);

        await deployer.deploy(AccountStorage, KimlicContextStorage.address, transactionConfig);
        console.log(`AccountStorage deployed at address ${AccountStorage.address}`);
        setValueByPath(deployedConfig, "deployedContracts.accountStorageAddress", AccountStorage.address);

        await deployer.deploy(AccountStorageAdapter, KimlicContextStorage.address, transactionConfig);
        console.log(`AccountStorageAdapter deployed at address ${AccountStorageAdapter.address}`);
        setValueByPath(deployedConfig, "deployedContracts.accountStorageAdapterAddress", AccountStorageAdapter.address);

        await deployer.deploy(RelyingPartyStorageAdapter, KimlicContextStorage.address, transactionConfig);
        console.log(`RelyingPartyStorageAdapter deployed at address ${RelyingPartyStorageAdapter.address}`);
        setValueByPath(deployedConfig, "deployedContracts.relyingPartyStorageAdapterAddress", RelyingPartyStorageAdapter.address);

        await deployer.deploy(RelyingPartyStorage, KimlicContextStorage.address, transactionConfig);
        console.log(`RelyingPartyStorage deployed at address ${RelyingPartyStorage.address}`);
        setValueByPath(deployedConfig, "deployedContracts.relyingPartyStorageAddress", RelyingPartyStorage.address);

        await deployer.deploy(AttestationPartyStorageAdapter, KimlicContextStorage.address, transactionConfig);
        console.log(`AttestationPartyStorageAdapter deployed at address ${AttestationPartyStorageAdapter.address}`);
        setValueByPath(deployedConfig, "deployedContracts.attestationPartyStorageAdapterAddress", AttestationPartyStorageAdapter.address);

        await deployer.deploy(AttestationPartyStorage, KimlicContextStorage.address, transactionConfig);
        console.log(`AttestationPartyStorage deployed at address ${AttestationPartyStorage.address}`);
        setValueByPath(deployedConfig, "deployedContracts.attestationPartyStorageAddress", AttestationPartyStorage.address);

        await deployer.deploy(VerificationContractFactory, KimlicContextStorage.address, transactionConfig);
        console.log(`VerificationContractFactory deployed at address ${VerificationContractFactory.address}`);
        setValueByPath(deployedConfig, "deployedContracts.verificationContractFactoryAddress", VerificationContractFactory.address);

        await deployer.deploy(ProvisioningContractFactory, KimlicContextStorage.address, transactionConfig);
        console.log(`ProvisioningContractFactory deployed at address ${ProvisioningContractFactory.address}`);
        setValueByPath(deployedConfig, "deployedContracts.provisioningContractFactoryAddress", ProvisioningContractFactory.address);

        await deployer.deploy(KimlicToken, transactionConfig);
        console.log(`KimlicToken deployed at address ${KimlicToken.address}`);
        setValueByPath(deployedConfig, "deployedContracts.kimlicTokenAddress", KimlicToken.address);

        await deployer.deploy(RewardingContract, KimlicContextStorage.address, transactionConfig);
        console.log(`RewardingContract deployed at address ${RewardingContract.address}`);
        setValueByPath(deployedConfig, "deployedContracts.rewardingContractAddress", RewardingContract.address);

        saveDeployedConfig();
    });
};
