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

    function createEmailVerification(address account, address coOwnerAddress, address verificatorAddress, string key) public {
        createBaseVerificationContract(account, coOwnerAddress, verificatorAddress, key, "email");
    }

    function createPhoneVerification(address account, address coOwnerAddress, address verificatorAddress, string key) public {
        createBaseVerificationContract(account, coOwnerAddress, verificatorAddress, key, "phone");
    }

    function createDocumentVerification(address account, address coOwnerAddress, address verificatorAddress, string key) public {
        createBaseVerificationContract(account, coOwnerAddress, verificatorAddress, key, "documents.id_card");
    }

    /// private methods ///
    function createBaseVerificationContract(
        address account, address coOwnerAddress, address verificatorAddress, string key,
        string accountFieldName) private {
        
        KimlicContractsContext context = getContext();

        uint rewardAmount = context.getVerificationPriceList().getPrice(accountFieldName);

        uint dataIndex = context.getAccountStorageAdapter().getFieldHistoryLength(account, accountFieldName);
        require(dataIndex > 0, "Data is empty");

        address verificationContractAddress = context.getAccountStorageAdapter()
            .getAccountDataVerificationContractAddress(account, accountFieldName, dataIndex);
        require(verificationContractAddress == address(0), "Verification contract for this data already created");

        BaseVerification createdContract = new BaseVerification(
            _storage, rewardAmount, account, coOwnerAddress, dataIndex, verificatorAddress, accountFieldName);
        createdContract.transferOwnership(msg.sender);

        address createdContractAddress = address(createdContract);
        createdContracts[createdContractAddress] = true;
        contracts[key] = createdContractAddress;
        context.getKimlicToken().transferFrom(coOwnerAddress, createdContractAddress, rewardAmount);
        
        context.getAccountStorageAdapter().setAccountFieldVerificationContractAddress(
            account, accountFieldName, createdContractAddress);
    }
}
