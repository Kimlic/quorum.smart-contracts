/*jshint esversion: 6 *//*jshint esversion: 6 */
const VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
const BaseVerification = artifacts.require("./BaseVerification.sol");
const AccountStorageAdapter = artifacts.require("./AccountStorageAdapter.sol");
const ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
const ProvisioningContract = artifacts.require("./ProvisioningContract.sol");

const { addData } = require("./Helpers/AccountHelper.js");
const { getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");
const { getValueByPath, combinePath, uuidv4 } = require("../commonLogic/commonLogic");
const { emptyAddress, createAccountAndSet1EthToBalance } = require("../commonLogic/commonEthereumLogic");

contract("Provisioning.Negative", function () {
  const deployedConfig = getNetworkDeployedConfig(web3.version.network);
  let accountAddress = "";
  let secondAccountAddress = "";

  before("create account", async () => {
    const account = await createAccountAndSet1EthToBalance(web3, deployedConfig.deployerAddress);
    accountAddress = account.accountAddress;
    console.log(`accountAddress: ${accountAddress}`);
    const secondAccount = await createAccountAndSet1EthToBalance(web3, deployedConfig.deployerAddress);
    secondAccountAddress = secondAccount.accountAddress;
    console.log(`second account address: ${secondAccountAddress}`);
  });

  const testProvisioning = (fieldName, attestationPartyAddress) => {
    const path = combinePath(deployedConfigPathConsts.partiesConfig.createdParties.party.pathTemplate, { partyName: "firstRelyingParty" });
    const relyingPartyConfig = getValueByPath(deployedConfig, path, {});
    relyingPartySendConfig = { from: relyingPartyConfig.address };
    it("Unlock relying party account", async () => {
      await web3.personal.unlockAccount(relyingPartyConfig.address, relyingPartyConfig.password, 100);
    });

    const provisioningContractkey = uuidv4();
    const verificationContractkey = uuidv4();
    const attestationPartySendConfig = { from: attestationPartyAddress };
    it(`Init account with verified "${fieldName}" data`, async () => {
      const adapter = await AccountStorageAdapter.deployed();
      await addData(adapter, fieldName + "ProvisioningTest", fieldName, accountAddress);

      const verificationContractFactory = await VerificationContractFactory.deployed();
      await verificationContractFactory.createBaseVerificationContract(accountAddress, attestationPartyAddress,
        verificationContractkey, fieldName, relyingPartySendConfig);
      const verificationContractAddress = await verificationContractFactory.getVerificationContract.call(verificationContractkey, attestationPartySendConfig);
      const verificationContract = await BaseVerification.at(verificationContractAddress);
      await verificationContract.finalizeVerification(true, attestationPartySendConfig);
    });

    it(`Should not create provisioning "${fieldName}" contract without filled data`, async () => {
      const provisioningContractFactory = await ProvisioningContractFactory.deployed();
      try {
        await provisioningContractFactory.createProvisioningContract(secondAccountAddress, fieldName, provisioningContractkey, relyingPartySendConfig);
      } catch (error) {
        return;
      }
      assert.fail('Expected throw not received');
    });

    it(`Should not return created provisioning contract address by wrong key`, async () => {
      const provisioningContractFactory = await ProvisioningContractFactory.deployed();
      const wrongProvisioningContractAddress = await provisioningContractFactory.getProvisioningContract.call("wrong key", relyingPartySendConfig);
      assert.equal(wrongProvisioningContractAddress, emptyAddress);
    });

    let provisioningContractAddress;
    it(`Create provisioning "${fieldName}" contract`, async () => {
      const provisioningContractFactory = await ProvisioningContractFactory.deployed();
      await provisioningContractFactory.createProvisioningContract(accountAddress, fieldName, provisioningContractkey, relyingPartySendConfig);
      provisioningContractAddress = await provisioningContractFactory.getProvisioningContract.call(provisioningContractkey, relyingPartySendConfig);
    });

    it(`Should not set provisioning result from not owner`, async () => {
      const provisioningContract = await ProvisioningContract.at(provisioningContractAddress);
      try {
        await provisioningContract.finalizeProvisioning({ from: secondAccountAddress });
      } catch (error) {
        return;
      }
      assert.fail('Expected throw not received');
    });

    it(`Should not return field data if not provisioning not finished.`, async () => {
      const provisioningContract = await ProvisioningContract.at(provisioningContractAddress);
      try {
        await provisioningContract.getData.call(relyingPartySendConfig, relyingPartySendConfig);
      } catch (error) {
        return;
      }
    });

    it(`Should not return field data if called from not owner.`, async () => {
      const provisioningContract = await ProvisioningContract.at(provisioningContractAddress);
      await provisioningContract.finalizeProvisioning(relyingPartySendConfig);
      try {
        await provisioningContract.getData.call(relyingPartySendConfig, { from: secondAccountAddress });
      } catch (error) {
        return;
      }
    });
  }
  const allowedFieldNamesConfig = getValueByPath(deployedConfig,
    deployedConfigPathConsts.accountStorageAdapter.allowedFieldNames.path);

  const partiesConfig = getValueByPath(deployedConfig, deployedConfigPathConsts.partiesConfig.createdParties.path);

  const attestationPartyByFieldName = {};

  Object.keys(partiesConfig).forEach(party => {
    const path = combinePath(deployedConfigPathConsts.partiesConfig.createdParties.party.allowedFieldNames.pathTemplate, { partyName: party })
    const partyAllowedFields = getValueByPath(deployedConfig, path, []);
    partyAllowedFields.forEach(allowedFieldName => {
      if (!attestationPartyByFieldName[allowedFieldName]) {
        attestationPartyByFieldName[allowedFieldName] = [];
      }
      const attestationPartiesForField = attestationPartyByFieldName[allowedFieldName];
      attestationPartiesForField.push(party);
    });
  });

  allowedFieldNamesConfig.forEach(fieldName => {
    if (fieldName != "device") {
      console.log(`fieldName: ${fieldName}`);
      const attestationPartyList = attestationPartyByFieldName[fieldName];
      console.log(`attestation parties list: ${JSON.stringify(attestationPartyList)}`);
      if (attestationPartyList && attestationPartyList.length > 0) {
        const attestationPartyName = attestationPartyList[0];
        console.log(`attestation party name: ${attestationPartyName}`);
        const path = combinePath(deployedConfigPathConsts.partiesConfig.createdParties.party.pathTemplate, { partyName: attestationPartyName })
        const partyConfig = getValueByPath(deployedConfig, path, {});
        console.log(`partyConfig: ${JSON.stringify(partyConfig)}`);


        it(`Should unlock attestation party. address ${partyConfig.address}, password: ${partyConfig.password}`, async () => {
          await web3.personal.unlockAccount(partyConfig.address, partyConfig.password, 1000);
        });
        testProvisioning(fieldName, partyConfig.address);
      }
    }
  });
});