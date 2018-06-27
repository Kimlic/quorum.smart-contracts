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
    uint private _rewardAmount;
    mapping(string=>address) private contracts;

    /// Constructors ///
    constructor(address contextStorage) public WithKimlicContext(contextStorage) {
        _rewardAmount = 1;
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
        uint dataIndex = context.getAccountStorageAdapter().getFieldHistoryLength(account, accountFieldName);
        BaseVerification createdContract = new BaseVerification(
            _storage, _rewardAmount, account, coOwnerAddress, dataIndex, verificatorAddress, accountFieldName);
        createdContract.transferOwnership(msg.sender);

        address createdContractAddress = address(createdContract);
        createdContracts[createdContractAddress] = true;
        contracts[key] = createdContractAddress;
        context.getKimlicToken().transferFrom(coOwnerAddress, createdContractAddress, _rewardAmount);
    }
}
