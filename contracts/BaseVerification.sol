pragma solidity ^0.4.23;


import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorageAdapter.sol";
import "./WithKimlicContext.sol";
import "./KimlicToken.sol";
import "./VerificationContractFactory.sol";

/// @title Template definition for attribute verification case
/// @author Bohdan Grytsenko
/// @notice Used as template for VerificationContractFactory to create verification contract instance each time when it's requested
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
        
        KimlicContractsContext context = getContext();
        VerificationContractFactory factory = context.getVerificationContractFactory();
        require(msg.sender == address(factory));
        tokensUnlockAt = block.timestamp + factory.getTokensLockPeriod(accountFieldName) * 1 minutes;

        coOwner = coOwnerAddress;
        accountAddress = account;
        dataIndex = index;
        accountFieldName = fieldName;
        rewardAmount = reward;
        _status = Status.Created;
    }

    /// @notice executed by Attestation party once it has completed attribute verification
    /// @param verificationResult true is verification passed with positive result, false if not
    function finalizeVerification(bool verificationResult) public onlyOwner() {
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

    /// @notice returns attribute value set on user profile and going to be verified by this contract
    /// @return attribute value
    function getData() view public onlyOwner() returns (string data) {
        return getContext().getAccountStorageAdapter().getFieldMainData(accountAddress, accountFieldName, dataIndex);
    }

    /// @notice executed by party which requested attribute verification to get tokens back from contract. Tokens will be returned only after certain timestamp defined as tokensUnlockAt
    function withdraw() public onlyOwner() {
        require(block.timestamp >= tokensUnlockAt && _status == Status.Created);
        KimlicContractsContext context = getContext();

        _status = Status.Canceled;
        KimlicToken kimlicToken = getContext().getKimlicToken();
        kimlicToken.transfer(owner, kimlicToken.balanceOf(address(this)));
        
        context.getAccountStorageAdapter().setFieldVerificationContractAddress(accountAddress, accountFieldName, dataIndex, address(0));
    }

    /// @notice returns verification status, defined as enum Status { None, Created, Verified, Unverified, Canceled }
    function getStatus() public view readStatusRestriction() returns(Status) {
        return _status;
    }

    /// @notice returns string label of verification status
    function getStatusName() public view readStatusRestriction() returns(string) {
        if (_status == Status.None) {
            return "None";
        }
        if (_status == Status.Created) {
            return "Created";
        }
        if (_status == Status.Verified) {
            return "Verified";
        }
        if (_status == Status.Unverified) {
            return "Unverified";
        }
        if (_status == Status.Canceled) {
            return "Canceled";
        }
    }

    modifier readStatusRestriction() {
        KimlicContractsContext context = getContext();
        require(
            context.getProvisioningContractFactory().createdContracts(msg.sender) || //TODO add additional check()
            msg.sender == address(context.getAccountStorageAdapter()) || //TODO add additional check()
            msg.sender == owner ||
            msg.sender == address(context.getRewardingContract()) || //TODO add additional check()
            msg.sender == context.owner());
        _;
    }
}
