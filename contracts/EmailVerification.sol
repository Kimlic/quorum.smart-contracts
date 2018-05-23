pragma solidity 0.4.24;


import "./AccountStorage.sol";
import "./BaseVerification.sol";


contract EmailVerification is BaseVerification {

    constructor(address accountStorage, bytes32 account, bytes32 dataHash, address verifier, uint rewardAmount)
            public BaseVerification(accountStorage, account, dataHash, verifier, rewardAmount) {
    }


    function setVerificationMeta() public {
        AccountStorage.Meta[] metaArray;
        
        var (data,  objectType, keys, isVerified, verifiedBy, verifiedAt) = 
            _accountStorage.getAccountData(_accountIndex, "email");
            
        var meta = AccountStorage.Meta({
            data:data,
            objectType: objectType,
            keys: keys,
            isVerified: isVerified,
            verifiedBy: verifiedBy,
            verifiedAt: verifiedAt
        });
        
        metaArray.push(meta);
    }
    
    
    function setVerificationResult(bool verificationResult) public {
        AccountStorage.Meta memory meta = verificationMeta[0];
        meta.verifiedAt = now;
        meta.verifiedBy = _verifier;
        meta.isVerified = verificationResult;
    }
}
