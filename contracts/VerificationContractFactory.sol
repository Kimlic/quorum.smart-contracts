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

    /// Constructors ///
    constructor(address contextStorage) public WithKimlicContext(contextStorage) {
        _rewardAmount = 1;
    }

    /// public methods ///
    function createEmailVerification(address account, address coOwnerAddress)
            public returns(BaseVerification createdContract) {

        createdContract = new BaseVerification(_storage, account,
            _rewardAmount, coOwnerAddress, AccountStorageAdapter.AccountFieldName.Email);
        createdContract.transferOwnership(msg.sender);
        createdContracts[address(createdContract)] = true;
    }

    function createPhoneVerification(address account, address coOwnerAddress)
            public returns(BaseVerification createdContract) {

        createdContract = new BaseVerification(_storage, account,
            _rewardAmount, coOwnerAddress, AccountStorageAdapter.AccountFieldName.Phone);
        createdContract.transferOwnership(msg.sender);
        createdContracts[address(createdContract)] = true;
    }
}
