/*jshint esversion: 6 */
const KimlicToken = artifacts.require("./KimlicToken.sol");
const VerificationContractFactory = artifacts.require("./VerificationContractFactory.sol");
const ProvisioningContractFactory = artifacts.require("./ProvisioningContractFactory.sol");
const AttestationPartyStorageAdapter = artifacts.require("./AttestationPartyStorageAdapter.sol");

const { setupAPAccessToFieldVerification, setupParty } = require("./Helpers/PartyCreatingHelper");
const { getFormatedConsoleLabel, getValueByPath, uuidv4 } = require("../commonLogic/commonLogic");
const { saveDeployedConfig, getNetworkDeployedConfig, deployedConfigPathConsts } = require("../deployedConfigHelper");

// Parameters

const kimlicName = "kimlic"
const kimlicCoinbaseAddress = "0x2d53b00ed1a56437b19adc4e6192c6d1b78f708c"
const kimlicPassword = "" // uuidv4() + "p@ssw0rd"
const allowedKimlicTypes = ["email", "phone"]
const apName = "veriff"
// const apCoinbaseAddress = "0xa6eccf2ffdf93a7c7d90334ecbbc06c806636a5d"
const apPassword = "" // uuidv4() + "p@ssw0rd"
// const rpName = "demoKimlic"
// const rpCoinabseAddress = "0x23dcf72087a240adf530023037d6378e81021466"
// const rpPassword = "" // uuidv4() + "p@ssw0rd"
const allowedDoctypes = [
  "documents.id_card", 
  "documents.passport", 
  "documents.driver_license", 
  "documents.residence_permit_card"
]

/**
 * Creation and setup of initial parties of Kimlic platform. In Production only Kimlic AP will be used. 
 * Veriff and FirstRelyingParty are created for dev & test purposes mostly
 */
module.exports = function (deployer) {
  const deployedConfig = getNetworkDeployedConfig(web3.version.network);
  const configPath = deployedConfigPathConsts.partiesConfig.createdParties.path;
  const currentSetup = getValueByPath(deployedConfig, configPath);

  deployer.then(async () => {
    console.log(getFormatedConsoleLabel(`Setup initial parties: ${kimlicName}`)) //, ${apName}, ${rpName}`))
    const contracts = {
      kimlicToken: KimlicToken,
      verificationContractFactory: VerificationContractFactory,
      provisioningContractFactory: ProvisioningContractFactory
    }

    // AP
    currentSetup[apName] = await setupParty(web3, deployedConfig, contracts, apName, null, apPassword);
    await setupAPAccessToFieldVerification(deployedConfig, AttestationPartyStorageAdapter, apName, currentSetup[apName].address, allowedDoctypes);

    // Kim
    currentSetup[kimlicName] = await setupParty(web3, deployedConfig, contracts, kimlicName, kimlicCoinbaseAddress, kimlicPassword);
    await setupAPAccessToFieldVerification(deployedConfig, AttestationPartyStorageAdapter, kimlicName, currentSetup[kimlicName].address, allowedKimlicTypes);

    // // RP
    // currentSetup[rpName] = await setupParty(web3, deployedConfig, contracts, rpName, rpCoinabseAddress, rpPassword);
    // console.log(JSON.stringify(currentSetup, null, 4));

    saveDeployedConfig()
  })
}
