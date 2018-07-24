pragma solidity ^0.4.23;


import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorageAdapter.sol";
import "./WithKimlicContext.sol";
import "./KimlicToken.sol";

contract BaseVerification is Ownable, WithKimlicContext {
    /// public attributes ///
    string public accountFieldName;
    address public coOwner;
    uint public dataIndex;
    address public accountAddress;
    uint public tokensUnlockAt;
    uint public verifiedAt;
    uint public rewardAmount;
    
    /// enums ///
    enum Status { None, Created, Verified, Unverified, Canceled }

    /// private attributes ///
    Status public _status;

    /// constructors ///
    constructor(address contextStorage, uint reward, address account, address coOwnerAddress, uint index, string fieldName)
        public WithKimlicContext(contextStorage) Ownable() {

        coOwner = coOwnerAddress;
        accountAddress = account;
        dataIndex = index;
        accountFieldName = fieldName;
        rewardAmount = reward;
        _status = Status.Created;
    }

    /// public methods ///
    function setVerificationResult(bool verificationResult) public onlyOwner() {
        require(_status == Status.Created);

        KimlicContractsContext context = getContext();
        KimlicToken token = context.getKimlicToken();
        require(token.balanceOf(address(this)) == rewardAmount);

        token.transfer(owner, rewardAmount);

        _status = verificationResult? Status.Verified: Status.Unverified;
        verifiedAt = block.timestamp;

        if (verificationResult == true) {
            context.getRewardingContract().checkMilestones(accountAddress, accountFieldName);
        }
    }

    function getData() view public onlyOwner() returns (string data) {
        return getContext().getAccountStorageAdapter().getFieldMainData(accountAddress, accountFieldName, dataIndex);
    }

    function withdraw() public onlyOwner() {
        require(block.timestamp >= tokensUnlockAt && _status == Status.Created);
        KimlicContractsContext context = getContext();

        _status = Status.Canceled;
        KimlicToken kimlicToken = getContext().getKimlicToken();
        kimlicToken.transfer(owner, kimlicToken.balanceOf(address(this)));
        
        context.getAccountStorageAdapter().setFieldVerificationContractAddress(accountAddress, accountFieldName, dataIndex, address(0));
    }

    function getStatus() public view returns(Status) {
        KimlicContractsContext context = getContext();
        require(
            context.getProvisioningContractFactory().createdContracts(msg.sender) ||
            msg.sender == address(context.getAccountStorageAdapter()) ||
            msg.sender == owner ||
            msg.sender == address(context.getRewardingContract()) ||
            msg.sender == context.owner());
        return _status;
    }
}
