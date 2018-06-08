pragma solidity ^0.4.23;


import "./openzeppelin-solidity/Ownable.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicContractsContext.sol";
import "./BaseVerification.sol";
import "./WithKimlicContext.sol";

contract RewardingContract is Ownable, WithKimlicContext {
    /// public attributes ///
    uint public mielstone1Reward;
    uint public mielstone2Reward;
    
    /// private attributes ///
    
    /// Constructors ///
    constructor (address contextStorage) public WithKimlicContext(contextStorage) {
    }

    /// public methods ///
    function setMilestone1Reward(uint rewardAmount) public onlyOwner() {
        mielstone1Reward = rewardAmount;
    }

    function setMilestone2Reward(uint rewardAmount)  public onlyOwner() {
        mielstone2Reward = rewardAmount;
    }


    function checkMilestones(address accountAddress, AccountStorageAdapter.AccountFieldName accountFieldName) public {
        if (accountFieldName == AccountStorageAdapter.AccountFieldName.Email ||
            accountFieldName == AccountStorageAdapter.AccountFieldName.Phone) {
            
            checkMilestone1(accountAddress);
        } 
        else if (accountFieldName == AccountStorageAdapter.AccountFieldName.Identity) {
            checkMilestone1(accountAddress);
        }
    }

    /// private methods ///
    function checkMilestone1(address accountAddress) private {
        if (getIsDataVerified(accountAddress, AccountStorageAdapter.AccountFieldName.Email) &&
            getIsDataVerified(accountAddress, AccountStorageAdapter.AccountFieldName.Phone)) {
            
            getContext().getKimlicToken().transfer(accountAddress, mielstone2Reward);
        }
        
    }

    function checkMilestone2(address accountAddress) private {
        if (getIsDataVerified(accountAddress, AccountStorageAdapter.AccountFieldName.Identity)) {
            getContext().getKimlicToken().transfer(accountAddress, mielstone2Reward);
        }
    }

    function getIsDataVerified(address accountAddress, AccountStorageAdapter.AccountFieldName accountFieldName) 
            private view returns(bool isVerified) {
        address verifiedBy = getContext().getAccountStorageAdapter()
            .getLastAccountDataVerifiedBy(accountAddress, accountFieldName);
        
        if (verifiedBy != address(0)) {
            BaseVerification verificationContract = BaseVerification(verifiedBy);   
            isVerified = verificationContract.isVerified();
        }
    }
}