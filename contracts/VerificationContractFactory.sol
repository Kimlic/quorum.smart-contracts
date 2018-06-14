pragma solidity ^0.4.23;


import "./openzeppelin-solidity/Ownable.sol";
import "./BaseVerification.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicContractsContext.sol";
import "./WithKimlicContext.sol";

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

    function createEmailVerification(address account, address coOwnerAddress, string key) public {

        BaseVerification createdContract = new BaseVerification(_storage, account,
            _rewardAmount, coOwnerAddress, AccountStorageAdapter.AccountFieldName.Email);
        createdContract.transferOwnership(msg.sender);
        createdContracts[address(createdContract)] = true;
        contracts[key] = address(createdContract);
    }

    function createPhoneVerification(address account, address coOwnerAddress, string key) public {
        BaseVerification createdContract = new BaseVerification(_storage, account,
            _rewardAmount, coOwnerAddress, AccountStorageAdapter.AccountFieldName.Phone);
        createdContract.transferOwnership(msg.sender);
        createdContracts[address(createdContract)] = true;
        contracts[key] = address(createdContract);
    }
}
