pragma solidity ^0.4.23;


import "./openzeppelin-solidity/Ownable.sol";
import "./BaseVerification.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicContractsContext.sol";
import "./WithKimlicContext.sol";
import "./KimlicToken.sol";

contract VerificationContractFactory is WithKimlicContext {
    /// public attributes ///
    mapping(address=>bool) public createdContracts;

    /// private attributes ///
    mapping(string=>address) private contracts;

    /// Constructors ///
    constructor(address contextStorage) public WithKimlicContext(contextStorage) {
    }

    /// public methods ///
    function getVerificationContract(string key) view public returns (address) {
        return contracts[key];
    }

    function createEmailVerification(address account, address attestationPartyAddress, string key) public {
        createBaseVerificationContract(account, attestationPartyAddress, key, "email");
    }

    function createPhoneVerification(address account, address attestationPartyAddress, string key) public {
        createBaseVerificationContract(account, attestationPartyAddress, key, "phone");
    }

    function createDocumentVerification(address account, address attestationPartyAddress, string key) public {
        createBaseVerificationContract(account, attestationPartyAddress, key, "documents.id_card");
    }

    /// private methods ///
    function createBaseVerificationContract(address account, address attestationPartyAddress, string key, string accountFieldName) private {
        KimlicContractsContext context = getContext();

        AccountStorageAdapter accountStorageAdapter = context.getAccountStorageAdapter();
        uint dataIndex = accountStorageAdapter.getFieldHistoryLength(account, accountFieldName);
        require(dataIndex > 0, "Data is empty");

        address verificationContractAddress = context.getAccountStorageAdapter()
            .getAccountDataVerificationContractAddress(account, accountFieldName, dataIndex);
        require(verificationContractAddress == address(0), "Verification contract for this data already created");

        require(
            context.getAttestationPartyStorageAdapter().getIsFieldVerificationAllowed(attestationPartyAddress, accountFieldName),
            "provided attestation party have not access to this field verification");

        uint rewardAmount = context.getVerificationPriceList().getPrice(accountFieldName);

        BaseVerification createdContract = new BaseVerification(
            _storage, rewardAmount, account, msg.sender, dataIndex, attestationPartyAddress, accountFieldName);
        createdContract.transferOwnership(attestationPartyAddress);

        address createdContractAddress = address(createdContract);
        createdContracts[createdContractAddress] = true;
        contracts[key] = createdContractAddress;
        context.getKimlicToken().transferFrom(msg.sender, createdContractAddress, rewardAmount);
        
        context.getAccountStorageAdapter().setAccountFieldVerificationContractAddress(account, accountFieldName, createdContractAddress);
    }
}
