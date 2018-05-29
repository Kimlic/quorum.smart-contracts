pragma solidity 0.4.24;


import "./Ownable.sol";
import "./BaseSimpleVerification.sol";
import "./AccountStorageAdapter.sol";

contract VerificationContractFactory {
    AccountStorageAdapter private _accountStorage;
    address private _verifier;
    uint private rewardAmount;

    constructor() public {
        _verifier = address(0);
        _accountStorage = AccountStorageAdapter(address(0));
        rewardAmount = 1;
    }

    function createEmailVerification(address account)
            public returns(address createdContract) {
        createdContract = new BaseSimpleVerification(_accountStorage, account,
            _verifier, rewardAmount, AccountStorage.AccountFieldName.Email);
    }

    function createPhoneVerification(address account)
            public returns(address createdContract) {
        createdContract = new BaseSimpleVerification(_accountStorage, account,
            _verifier, rewardAmount, AccountStorage.AccountFieldName.Phone);
    }
}
