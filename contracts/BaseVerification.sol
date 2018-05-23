pragma solidity 0.4.24;


import "./AccountStorage.sol";

contract BaseVerification {
    AccountStorage internal _accountStorage;
    bytes32 internal _accountIndex;
    bytes32 internal _dataHash;
    address internal _verifier;
    uint internal _rewardAmount;
    AccountStorage.Meta[] public verificationMeta;

    constructor(address accountStorage, bytes32 account, bytes32 dataHash, address verifier,
        uint rewardAmount) public {

        _accountIndex = account;
        _dataHash = dataHash;
        _verifier = verifier;
        _rewardAmount = rewardAmount;
        
        setVerificationMeta();
    }

    function setVerificationResult(bool verificationResult) public {
        AccountStorage.Meta memory meta = verificationMeta[0];
        meta.verifiedAt = now;
        meta.verifiedBy = _verifier;
        meta.isVerified = verificationResult;
    }

    function setVerificationMeta() public;
    
}
