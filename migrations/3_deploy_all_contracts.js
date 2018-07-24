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
const { deployedConfigPathConsts, saveDeployedConfig, getNetworkDeployedConfig } = require("../deployedConfigHelper");
const { setValueByPath } = require("../commonLogic");


module.exports = function(deployer, network, accounts) {
    console.log(getFormatedConsoleLabel("deploy all contracts: "));
    let transactionConfig = getTransactionConfig(deployer, network, accounts);

    let deployedConfig = getNetworkDeployedConfig(web3.version.network);
    const contractPathConsts = deployedConfigPathConsts.deployedContracts;

    deployer.then(async () => {
        await deployer.deploy(KimlicContextStorage, transactionConfig);
        console.log(`KimlicContextStorage deployed at address ${KimlicContextStorage.address}`);
        setValueByPath(deployedConfig, contractPathConsts.kimlicContextStorageAddress.path, KimlicContextStorage.address);

        await deployer.deploy(KimlicContractsContext, KimlicContextStorage.address, transactionConfig);
        console.log(`KimlicContractsContext deployed at address ${KimlicContractsContext.address}`);
        setValueByPath(deployedConfig, contractPathConsts.kimlicContractsContextAddress.path, KimlicContractsContext.address);

        await deployer.deploy(AccountStorage, KimlicContextStorage.address, transactionConfig);
        console.log(`AccountStorage deployed at address ${AccountStorage.address}`);
        setValueByPath(deployedConfig, contractPathConsts.accountStorageAddress.path, AccountStorage.address);

        await deployer.deploy(AccountStorageAdapter, KimlicContextStorage.address, transactionConfig);
        console.log(`AccountStorageAdapter deployed at address ${AccountStorageAdapter.address}`);
        setValueByPath(deployedConfig, contractPathConsts.accountStorageAdapterAddress.path, AccountStorageAdapter.address);

        await deployer.deploy(RelyingPartyStorageAdapter, KimlicContextStorage.address, transactionConfig);
        console.log(`RelyingPartyStorageAdapter deployed at address ${RelyingPartyStorageAdapter.address}`);
        setValueByPath(deployedConfig, contractPathConsts.relyingPartyStorageAdapterAddress.path, RelyingPartyStorageAdapter.address);

        await deployer.deploy(RelyingPartyStorage, KimlicContextStorage.address, transactionConfig);
        console.log(`RelyingPartyStorage deployed at address ${RelyingPartyStorage.address}`);
        setValueByPath(deployedConfig, contractPathConsts.relyingPartyStorageAddress.path, RelyingPartyStorage.address);

        await deployer.deploy(AttestationPartyStorageAdapter, KimlicContextStorage.address, transactionConfig);
        console.log(`AttestationPartyStorageAdapter deployed at address ${AttestationPartyStorageAdapter.address}`);
        setValueByPath(deployedConfig, contractPathConsts.attestationPartyStorageAdapterAddress.path, AttestationPartyStorageAdapter.address);

        await deployer.deploy(AttestationPartyStorage, KimlicContextStorage.address, transactionConfig);
        console.log(`AttestationPartyStorage deployed at address ${AttestationPartyStorage.address}`);
        setValueByPath(deployedConfig, contractPathConsts.attestationPartyStorageAddress.path, AttestationPartyStorage.address);

        await deployer.deploy(VerificationContractFactory, KimlicContextStorage.address, transactionConfig);
        console.log(`VerificationContractFactory deployed at address ${VerificationContractFactory.address}`);
        setValueByPath(deployedConfig, contractPathConsts.verificationContractFactoryAddress.path, VerificationContractFactory.address);

        await deployer.deploy(ProvisioningContractFactory, KimlicContextStorage.address, transactionConfig);
        console.log(`ProvisioningContractFactory deployed at address ${ProvisioningContractFactory.address}`);
        setValueByPath(deployedConfig, contractPathConsts.provisioningContractFactoryAddress.path, ProvisioningContractFactory.address);

        await deployer.deploy(KimlicToken, transactionConfig);
        console.log(`KimlicToken deployed at address ${KimlicToken.address}`);
        setValueByPath(deployedConfig, contractPathConsts.kimlicTokenAddress.path, KimlicToken.address);

        await deployer.deploy(RewardingContract, KimlicContextStorage.address, transactionConfig);
        console.log(`RewardingContract deployed at address ${RewardingContract.address}`);
        setValueByPath(deployedConfig, contractPathConsts.rewardingContractAddress.path, RewardingContract.address);

        saveDeployedConfig();
    });
};