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
    Status public status;
    uint public dataIndex;
    address public attestationParty;
    address public accountAddress;
    uint public tokensUnlockAt;
    uint public verifiedAt;
    
    /// enums ///
    enum Status { Created, Verified, Unverified, Canceled }

    /// private attributes ///
    uint internal _rewardAmount;//TODO make it public or remove

    /// constructors ///
    constructor(
        address contextStorage, uint rewardAmount, address account, address coOwnerAddress, uint index, address attestationPartyAddress,
        string fieldName) public WithKimlicContext(contextStorage) Ownable() {

        coOwner = coOwnerAddress;
        accountAddress = account;
        dataIndex = index;
        attestationParty = attestationPartyAddress;
        accountFieldName = fieldName;
        _rewardAmount = rewardAmount;
    }

    /// public methods ///
    function setVerificationResult(bool verificationResult) public onlyOwner() {
        require(status == Status.Created);

        KimlicContractsContext context = getContext();
        KimlicToken token = context.getKimlicToken();
        require(token.balanceOf(address(this)) == _rewardAmount);
        
        status = verificationResult? Status.Verified: Status.Unverified;

        token.transfer(owner, _rewardAmount);

        verifiedAt = block.timestamp;

        if (verificationResult == true) {
            context.getRewardingContract().checkMilestones(accountAddress, accountFieldName);
        }
    }

    function getData() view public onlyOwner() returns (string data) {
        return getContext().getAccountStorageAdapter().getFieldMainData(accountAddress, accountFieldName, dataIndex);
    }

    function withdraw() public onlyOwner() {
        require(block.timestamp >= tokensUnlockAt && status == Status.Created);
        KimlicContractsContext context = getContext();

        status = Status.Canceled;
        KimlicToken kimlicToken = getContext().getKimlicToken();
        kimlicToken.transfer(owner, kimlicToken.balanceOf(address(this)));
        
        context.getAccountStorageAdapter().setFieldVerificationContractAddress(accountAddress, accountFieldName, address(0));
    }
}
