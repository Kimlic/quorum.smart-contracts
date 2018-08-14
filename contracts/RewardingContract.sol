pragma solidity ^0.4.23;


import "./openzeppelin-solidity/Ownable.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicContractsContext.sol";
import "./BaseVerification.sol";
import "./WithKimlicContext.sol";

/// @title User rewarding contract
/// @author Bohdan Grytsenko
/// @notice Tracks milestones achievement and correspondent reward
contract RewardingContract is Ownable, WithKimlicContext {
    /// public attributes ///
    uint public milestone1Reward;
    uint public milestone2Reward;
    mapping (string=>bool) milestone2FieldNames;
    
    /// private attributes ///
    string private constant email = "email";
    string private constant phone = "phone";
    //string private constant identity = "identity";
    /// Constructors ///
    constructor (address contextStorage) public WithKimlicContext(contextStorage) {
    }

    /// @notice adds attribute to be cosidered for 2nd milestone
    /// @param fieldName attribute code
    function addMielstone2FieldName(string fieldName) public onlyOwner() {
        require(getContext().getAccountStorageAdapter().isAllowedFieldName(fieldName));
        milestone2FieldNames[fieldName] = true;
    }

    /// @notice removes attribute from being cosidered for 2nd milestone
    /// @param fieldName attribute code
    function removeMielstone2FieldName(string fieldName) public onlyOwner() {
        delete milestone2FieldNames[fieldName];
    }

    /// @notice defines reward amount for 1st milestone
    /// @param rewardAmount tokens reward amount
    function setMilestone1Reward(uint rewardAmount) public onlyOwner() {
        milestone1Reward = rewardAmount;
    }

    /// @notice defines reward amount for 2nd milestone
    /// @param rewardAmount tokens reward amount
    function setMilestone2Reward(uint rewardAmount)  public onlyOwner() {
        milestone2Reward = rewardAmount;
    }

    /// @notice triggers a check for specific user and attribute to see if any of milestones conditions reached
    /// @param accountAddress user account address
    /// @param accountFieldName attribute code
    function checkMilestones(address accountAddress, string accountFieldName) public {
        require(getContext().getVerificationContractFactory().createdContracts(msg.sender));
        if (isEqualStrings(accountFieldName, email) ||
            isEqualStrings(accountFieldName, phone)) { //TODO use same logic as milestone2?
            
            checkMilestone1(accountAddress);
        } 
        else if (milestone2FieldNames[accountFieldName]) {
            checkMilestone2(accountAddress, accountFieldName);
        }
    }

    /// private methods ///
    function checkMilestone1(address accountAddress) private {
        if (getIsRewardAlreadyGranted(accountAddress, 1)) {
            return;
        }
        if (getIsDataVerified(accountAddress, email) &&
            getIsDataVerified(accountAddress, phone)) {
            
            sendReward(accountAddress, milestone1Reward);
            getContext().getAccountStorageAdapter().setRewardedAt(accountAddress, 1);
        }
        
    }

    function checkMilestone2(address accountAddress, string fieldName) private {
        if (getIsRewardAlreadyGranted(accountAddress, 2)) {
            return;
        }
        if (getIsDataVerified(accountAddress, fieldName)) {
            sendReward(accountAddress, milestone2Reward);
            getContext().getAccountStorageAdapter().setRewardedAt(accountAddress, 2);
        }
    }

    function sendReward(address accountAddress, uint rewardAmount) private {
        KimlicContractsContext context = getContext();

        address communityTokenWalletAddress = context.getCommunityTokenWalletAddress();

        context.getKimlicToken().transferFrom(communityTokenWalletAddress, accountAddress, rewardAmount);
    }

    function getIsDataVerified(address accountAddress, string accountFieldName) 
            private view returns(bool isVerified) {
        address verificationContractAddress = getContext().getAccountStorageAdapter()
            .getLastFieldVerificationContractAddress(accountAddress, accountFieldName);
        
        if (verificationContractAddress != address(0)) {
            BaseVerification verificationContract = BaseVerification(verificationContractAddress);
            
            isVerified = verificationContract.getStatus() == BaseVerification.Status.Verified;
        }
    }

    function getIsRewardAlreadyGranted(address accountAddress, uint milestone) private view returns(bool isVerified) {
        return getContext().getAccountStorageAdapter().getRewardedAt(accountAddress, milestone) > 0;
    }

    function isEqualStrings(string leftValue, string rightValue) private pure returns(bool isEqual){
        isEqual = keccak256(bytes(leftValue)) == keccak256(bytes(rightValue));
    }

}