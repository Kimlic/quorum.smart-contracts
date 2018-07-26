pragma solidity ^0.4.23;


import "./ProvisioningContractFactory.sol";
import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicToken.sol";
import "./BaseVerification.sol";
import "./WithKimlicContext.sol";

contract ProvisioningContract is Ownable, WithKimlicContext {
    
    /// public attributes ///
    address public relyingParty;
    address public account;
    Status public status;
    uint public tokensUnlockAt;
    string private fieldName;
    uint private index;

    /// private attributes ///
    uint private _reward;
    /// enums ///
    enum Status { None, Created, DataProvided, Canceled }

    /// constructors ///
    constructor (
        address contextStorage, address accountAddress, string accountFieldName,
        uint fieldIndex, uint reward)
            public WithKimlicContext(contextStorage) {

        KimlicContractsContext context = getContext();
        ProvisioningContractFactory factory = context.getProvisioningContractFactory();
        require(msg.sender == address(factory));
        
        tokensUnlockAt = block.timestamp + factory.tokensLockPeriod() * 1 hours;
        
        account = accountAddress;
        _reward = reward;
        fieldName = accountFieldName;
        index = fieldIndex;
    }

    /// public methods ///

    function isVerificationFinished() public view returns(bool) {
        AccountStorageAdapter adapter = getContext().getAccountStorageAdapter();

        address verificationContractAddress = adapter.getFieldVerificationContractAddress(account, fieldName, index);

        if (verificationContractAddress != address(0)) {
            BaseVerification verificationContract = BaseVerification(verificationContractAddress);
            BaseVerification.Status verificationStatus = verificationContract.getStatus();
            return verificationStatus == BaseVerification.Status.Verified ||
                verificationStatus == BaseVerification.Status.Unverified;
        }
    }

    function finalizeProvisioning() public {
        status = Status.DataProvided;
        sendRewards();
    }
    
    function getData() public view onlyOwner() 
        returns(string data, BaseVerification.Status verificationStatus, address verificationContractAddress, uint256 verifiedAt) {

        require(status == Status.DataProvided);
        
        AccountStorageAdapter adapter = getContext().getAccountStorageAdapter();

        ( data ) = adapter.getFieldMainData(account, fieldName, index);

        ( verificationStatus, verificationContractAddress, verifiedAt ) = adapter.getFieldVerificationData(account, fieldName, index); 
    }

    function withdraw() public onlyOwner() {
        require(block.timestamp >= tokensUnlockAt && status == Status.Created);

        status = Status.Canceled;
        KimlicToken kimlicToken = getContext().getKimlicToken();
        kimlicToken.transfer(owner, kimlicToken.balanceOf(address(this)));
    }

    /// private methods ///

    function sendRewards() private {
        KimlicContractsContext context = getContext();

        address verificationContractAddress = context.getAccountStorageAdapter()
            .getFieldVerificationContractAddress(account, fieldName, index);

        BaseVerification verificationContract = BaseVerification(verificationContractAddress);
        address coOwner = verificationContract.coOwner();
        address attestationParty = verificationContract.owner();

        ProvisioningContractFactory factory = context.getProvisioningContractFactory();
        uint accountInterest = _reward * factory.accountInterestPercent() / 100;
        uint coOwnerInterest = _reward * factory.coOwnerInterestPercent() / 100;
        uint communityTokenWalletInterest = _reward * factory.communityTokenWalletInterestPercent() / 100;
        uint attestationPartyInterest = _reward * factory.attestationPartyInterestPercent() / 100;
        
        KimlicToken kimlicToken = context.getKimlicToken();
        kimlicToken.transfer(account, accountInterest);
        kimlicToken.transfer(coOwner, coOwnerInterest);
        kimlicToken.transfer(context.getCommunityTokenWalletAddress(), communityTokenWalletInterest);
        kimlicToken.transfer(attestationParty, attestationPartyInterest);
    }

    function getStatusName() public view returns(string) {
        if (status == Status.None) {
            return "None";
        }
        if (status == Status.Created) {
            return "Created";
        }
        if (status == Status.DataProvided) {
            return "DataProvided";
        }
        if (status == Status.Canceled) {
            return "Canceled";
        }
    }
}