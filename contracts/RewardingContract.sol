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
    string private constant email = "email";
    string private constant phone = "phone";
    //string private constant identity = "identity";
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
        require(getContext().getVerificationContractFactory().createdContracts(msg.sender));
        if (isEqualStrings(accountFieldName, email) ||
            isEqualStrings(accountFieldName, phone)) {
            
            checkMilestone1(accountAddress);
        } 
        /*else if (isEqualStrings(accountFieldName, identity)) {
            checkMilestone2(accountAddress);
        }*/
    }

    /// private methods ///
    function checkMilestone1(address accountAddress) private {
        if (getIsDataVerified(accountAddress, email) &&
            getIsDataVerified(accountAddress, phone)) {
            
            sendReward(accountAddress, mielstone1Reward);
        }
        
    }

    function checkMilestone2(address accountAddress) private {
        //TODO there is no "identity" field now, need to find out wich field must be checked
        /*if (getIsDataVerified(accountAddress, "")) {//identity)) {
            sendReward(accountAddress, mielstone2Reward);
        }*/
    }

    function sendReward(address accountAddress, uint rewardAmount) private {
        KimlicContractsContext context = getContext();

        address communityTokenWalletAddress = context.getCommunityTokenWalletAddress();

        context.getKimlicToken().transferFrom(communityTokenWalletAddress, accountAddress, rewardAmount);
    }

    function getIsDataVerified(address accountAddress, string accountFieldName) 
            private view returns(bool isVerified) {
        address verificationContractAddress = getContext().getAccountStorageAdapter()
            .getFieldLastVerificationContractAddress(accountAddress, accountFieldName);
        
        if (verificationContractAddress != address(0)) {
            BaseVerification verificationContract = BaseVerification(verificationContractAddress);
            
            isVerified = verificationContract.getStatus() == BaseVerification.Status.Verified;
        }
    }

    function isEqualStrings(string leftValue, string rightValue) private pure returns(bool isEqual){//TODO move to lib
        isEqual = keccak256(bytes(leftValue)) == keccak256(bytes(rightValue));
    }
}