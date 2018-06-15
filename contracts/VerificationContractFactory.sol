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

    function createEmailVerification(address account, address coOwnerAddress, uint dataIndex, address verificatorAddress, string key) public {
        createBaseVerificationContract(
            account, coOwnerAddress, dataIndex, verificatorAddress,
            key, AccountStorageAdapter.AccountFieldName.Email);
    }

    function createPhoneVerification(address account, address coOwnerAddress, uint dataIndex, address verificatorAddress, string key) public {
        createBaseVerificationContract(
            account, coOwnerAddress, dataIndex, verificatorAddress,
            key, AccountStorageAdapter.AccountFieldName.Phone);
    }

    function createDocumentVerification(address account, address coOwnerAddress, uint dataIndex, address verificatorAddress, string key) public {
        createBaseVerificationContract(
            account, coOwnerAddress, dataIndex, verificatorAddress,
            key, AccountStorageAdapter.AccountFieldName.Documents);
    }
    
    /// private methods ///
    function createBaseVerificationContract(
        address account, address coOwnerAddress, uint dataIndex, address verificatorAddress, string key,
        AccountStorageAdapter.AccountFieldName accountFieldName) private {
        
        BaseVerification createdContract = new BaseVerification(
            _storage, _rewardAmount, account, coOwnerAddress, dataIndex, verificatorAddress, accountFieldName);
        createdContract.transferOwnership(msg.sender);

        address createdContractAddress = address(createdContract);
        createdContracts[createdContractAddress] = true;
        contracts[key] = createdContractAddress;
        getContext().getKimlicToken().transferFrom(coOwnerAddress, createdContractAddress, _rewardAmount);
    }
}
