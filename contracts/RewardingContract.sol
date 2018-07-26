pragma solidity ^0.4.23;


import "./openzeppelin-solidity/Ownable.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicContractsContext.sol";
import "./BaseVerification.sol";
import "./WithKimlicContext.sol";

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

    /// public methods ///
    function addMielstone2FieldName(string fieldName) public onlyOwner() {
        require(getContext().getAccountStorageAdapter().isAllowedFieldName(fieldName));
        milestone2FieldNames[fieldName] = true;
    }

    function removeMielstone2FieldName(string fieldName) public onlyOwner() {
        delete milestone2FieldNames[fieldName];
    }

    function setMilestone1Reward(uint rewardAmount) public onlyOwner() {
        milestone1Reward = rewardAmount;
    }

    function setMilestone2Reward(uint rewardAmount)  public onlyOwner() {
        milestone2Reward = rewardAmount;
    }


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

    function isEqualStrings(string leftValue, string rightValue) private pure returns(bool isEqual){//TODO move to lib
        isEqual = keccak256(bytes(leftValue)) == keccak256(bytes(rightValue));
    }

}