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


    function checkMilestones(address accountAddress, string accountFieldName) public {
        string memory emailColumnName = "email";
        string memory phoneColumnName = "phone";
        string memory identityColumnName = "identity";
        if (isEqualStrings(accountFieldName, emailColumnName) ||
            isEqualStrings(accountFieldName, phoneColumnName)) {
            
            checkMilestone1(accountAddress);
        } 
        else if (isEqualStrings(accountFieldName, identityColumnName)) {
            checkMilestone1(accountAddress);
        }
    }

    /// private methods ///
    function checkMilestone1(address accountAddress) private {
        if (getIsDataVerified(accountAddress, "email") &&
            getIsDataVerified(accountAddress, "phone")) {
            
            sendReward(accountAddress, mielstone2Reward);
        }
        
    }

    function checkMilestone2(address accountAddress) private {
        if (getIsDataVerified(accountAddress, "identity")) {
            sendReward(accountAddress, mielstone2Reward);
        }
    }

    function sendReward(address accountAddress, uint rewardAmount) private {
        KimlicContractsContext context = getContext();

        address communityTokenWalletAddress = context.getCommunityTokenWalletAddress();

        context.getKimlicToken().transferFrom(communityTokenWalletAddress, accountAddress, rewardAmount);
    }

    function getIsDataVerified(address accountAddress, string accountFieldName) 
            private view returns(bool isVerified) {
        address verifiedBy = getContext().getAccountStorageAdapter()
            .getLastAccountDataVerifiedBy(accountAddress, accountFieldName);
        
        if (verifiedBy != address(0)) {
            BaseVerification verificationContract = BaseVerification(verifiedBy);   
            isVerified = verificationContract.isVerified();
        }
    }

    function isEqualStrings(string leftValue, string rightValue) private pure returns(bool isEqual){//TODO move to lib
        isEqual = keccak256(bytes(leftValue)) == keccak256(bytes(rightValue));
    }
}