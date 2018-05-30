pragma solidity ^0.4.23;


import "./AccountStorageAdapter.sol";

contract BaseVerification {
    AccountStorageAdapter internal _accountStorage;
    address internal _accountIndex;
    address internal _verifier;
    uint internal _rewardAmount;

    constructor(AccountStorageAdapter accountStorage, address account, address verifier, uint rewardAmount) public {

        _accountIndex = account;
        _verifier = verifier;
        _rewardAmount = rewardAmount;
        _accountStorage = accountStorage;
        
        setVerificationMeta();
    }

    function setVerificationResult(bool verificationResult) public;

    function setVerificationMeta() public;
    
}
