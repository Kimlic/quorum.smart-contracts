pragma solidity ^0.4.23;


import "./Ownable.sol";
import "./BaseVerification.sol";
import "./AccountStorageAdapter.sol";
import "./WithKimlicContext.sol";
import "./KimlicContractsContext.sol";

contract VerificationContractFactory is WithKimlicContext {
    mapping(address=>bool) createdContracts;

    uint private _rewardAmount;

    constructor(KimlicContractsContext context) public WithKimlicContext(context) {
        _rewardAmount = 1;
    }

    function createEmailVerification(address account)
            public returns(BaseVerification createdContract) {

        createdContract = new BaseVerification(_context, account,
            _rewardAmount, AccountStorageAdapter.AccountFieldName.Email);
        createdContract.transferOwnership(msg.sender);
        createdContracts[address(createdContract)] = true;
    }

    function createPhoneVerification(address account)
            public returns(BaseVerification createdContract) {

        createdContract = new BaseVerification(_context, account,
            _rewardAmount, AccountStorageAdapter.AccountFieldName.Phone);
        createdContract.transferOwnership(msg.sender);
        createdContracts[address(createdContract)] = true;
    }
}
