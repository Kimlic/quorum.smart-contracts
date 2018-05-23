pragma solidity 0.4.24;


import "./Ownable.sol";
import "./BaseSimpleVerification.sol";

contract VerificationContractFactory {
    address private _accountStorage;
    address private _verifier;
    uint private rewardAmount;

    constructor() public {
        _verifier = address(0);
        rewardAmount = 1;
    }

    function createEmailVerification(bytes32 account)
            public returns(address createdContract) {
        createdContract = new BaseSimpleVerification(_accountStorage, account,
            _verifier, rewardAmount, AccountStorage.AccountFieldName.Email);
    }

    function createPhoneVerification(bytes32 account)
            public returns(address createdContract) {
        createdContract = new BaseSimpleVerification(_accountStorage, account,
            _verifier, rewardAmount, AccountStorage.AccountFieldName.Phone);
    }
}
