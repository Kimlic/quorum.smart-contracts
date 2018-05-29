pragma solidity 0.4.24;


import "./AccountStorage.sol";
import "./BaseVerification.sol";


contract BaseSimpleVerification is BaseVerification {
    AccountStorage.Meta public verificationMeta;
    AccountStorage.AccountFieldName public accountFieldName;
    
    constructor(address accountStorage, address account, address verifier, uint rewardAmount, AccountStorage.AccountFieldName fieldName)
            public BaseVerification(accountStorage, account, verifier, rewardAmount) {
        accountFieldName = fieldName;
    }


    function setVerificationMeta() public {
        var (data, objectType, keys, isVerified, verifiedBy, verifiedAt) = 
            _accountStorage.getAccountData(_accountIndex, accountFieldName);
            
        verificationMeta = AccountStorage.Meta({
            data:data,
            objectType: objectType,
            keys: keys,
            isVerified: isVerified,
            verifiedBy: verifiedBy,
            verifiedAt: verifiedAt
        });
        
    }
    
    function setVerificationResult(bool verificationResult) public {
        
        _accountStorage.setVerificationResult(
            _accountIndex, accountFieldName, verificationResult, _verifier, block.timestamp);
    }
}
