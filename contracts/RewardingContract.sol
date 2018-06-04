pragma solidity ^0.4.23;


import "./Ownable.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicContractsContext.sol";
import "./BaseVerification.sol";

contract RewardingContract is Ownable {
    uint public mielstone1Reward;
    uint public mielstone2Reward;
    
    KimlicContractsContext private _context;

    constructor (KimlicContractsContext context) public {
        _context = context;
    }

    function setMilestone1Reward(uint rewardAmount) public onlyOwner() {
        mielstone1Reward = rewardAmount;
    }

    function setMilestone2Reward(uint rewardAmount)  public onlyOwner() {
        mielstone2Reward = rewardAmount;
    }


    function checkMilestones(address accountAddress, AccountStorageAdapter.AccountFieldName accountFieldName) public {
        if (accountFieldName == AccountStorageAdapter.AccountFieldName.Email ||
            accountFieldName == AccountStorageAdapter.AccountFieldName.Phone) {
            
            checkMilestone1(accountAddress, accountFieldName);
        } 
        else if (accountFieldName == AccountStorageAdapter.AccountFieldName.Identity) {
            checkMilestone1(accountAddress, accountFieldName);
        }
    }

    function checkMilestone1(address accountAddress, AccountStorageAdapter.AccountFieldName accountFieldName) private {
        if (getIsDataVerified(accountAddress, AccountStorageAdapter.AccountFieldName.Email) &&
            getIsDataVerified(accountAddress, AccountStorageAdapter.AccountFieldName.Phone)) {
            
            _context.kimlicToken().transfer(accountAddress, mielstone2Reward);
        }
        
    }

    function checkMilestone2(address accountAddress, AccountStorageAdapter.AccountFieldName accountFieldName) private {
        if (getIsDataVerified(accountAddress, accountFieldName)) {
            _context.kimlicToken().transfer(accountAddress, mielstone2Reward);
        }
    }

    function getIsDataVerified(address accountAddress, AccountStorageAdapter.AccountFieldName accountFieldName) 
            private view returns(bool isVerified) {
        address verifiedBy = _context.accountStorageAdapter()
            .getAccountDataVerifiedBy(accountAddress, accountFieldName);
        
        if (verifiedBy != address(0)) {
            BaseVerification verificationContract = BaseVerification(verifiedBy);   
            isVerified = verificationContract.isVerified();
        }
    }
}