pragma solidity 0.4.24;


import "./AccountStorage.sol";

contract BaseVerification {
    AccountStorage internal _accountStorage;
    bytes32 internal _accountIndex;
    address internal _verifier;
    uint internal _rewardAmount;

    constructor(address accountStorage, bytes32 account, address verifier, uint rewardAmount) public {

        _accountIndex = account;
        _verifier = verifier;
        _rewardAmount = rewardAmount;
        
        setVerificationMeta();
    }

    function setVerificationResult(bool verificationResult) public;

    function setVerificationMeta() public;
    
}
