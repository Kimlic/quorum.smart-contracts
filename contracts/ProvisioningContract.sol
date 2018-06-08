pragma solidity ^0.4.23;


import "./ProvisioningContractFactory.sol";
import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicToken.sol";
import "./BaseVerification.sol";

contract ProvisioningContract is Ownable {
    
    /// public attributes ///
    address public relyingParty;
    address public account;
    Status public status;

    /// private attributes ///
    KimlicContractsContext private _context;
    RequiredData[] private requiredDataArray;
    uint private expectedReward;

    /// structures ///
    struct RequiredData {
        AccountStorageAdapter.AccountFieldName fieldName;
        uint index;
        uint reward;
        address coOwner;
        address attestationParty;
    }//TODO move to factory?

    /// enums ///
    enum Status { DataInitialization, WaitingForTokens, Finished } //TODO move to factory?

    /// constructors ///
    constructor (KimlicContractsContext context, address accountAddress) public {
        require(msg.sender == address(_context.provisioningContractFactory()));

        _context = context;
        account = accountAddress;
        status = Status.DataInitialization;
    }

    /// public methods ///
    function addRequiredData(AccountStorageAdapter.AccountFieldName accountFieldName, uint index) public {        
        address verifiedBy = _context.accountStorageAdapter()
            .getLastAccountDataVerifiedBy(account, accountFieldName);

        BaseVerification verificationContract = BaseVerification(verifiedBy);    
        
        uint reward = _context.provisioningPrice().getPrice(accountFieldName);

        RequiredData memory data = RequiredData(
        {
            fieldName: accountFieldName,
            index: index,
            coOwner: verificationContract.coOwner(),
            attestationParty: verificationContract.owner(),
            reward: reward
        });

        requiredDataArray.push(data);
        expectedReward += reward;
    }
    
    function setNextStatus() public {
        if (status == Status.DataInitialization) {
            require(requiredDataArray.length > 0);
            status = Status.WaitingForTokens;
        } 
        else if (status == Status.WaitingForTokens) {
            require(_context.kimlicToken().balanceOf(address(this)) == expectedReward);
            status = Status.Finished;
        }
    }

    function getData(uint requiredDataArrayIndex) view public onlyOwner() returns(string data, string objectType,
            bool isVerified, address verifiedBy, uint256 verifiedAt) {

        RequiredData storage requiredData = requiredDataArray[requiredDataArrayIndex];
        
        return _context.accountStorageAdapter().getAccountData(account, requiredData.fieldName, requiredData.index);
    }
    

    /// private methods ///

    //TODO check gas consumption. Even with gas price 0 we still have gas limits
    function sendRewards() private {            
        ProvisioningContractFactory factory = _context.provisioningContractFactory();
        KimlicToken kimlicToken = _context.kimlicToken();

        uint communityTokenWalletInterestPercent = factory.communityTokenWalletInterestPercent();
        uint attestationPartyInterestPercent = factory.attestationPartyInterestPercent();
        uint accountInterestPercent = factory.accountInterestPercent();
        uint coOwnerInterestPercent = factory.coOwnerInterestPercent();

        for (uint index = 0; index < requiredDataArray.length; index++) {
            
            uint communityTokenWalletInterest = requiredDataArray[index].reward * communityTokenWalletInterestPercent / 100;
            uint attestationPartyInterest = requiredDataArray[index].reward * attestationPartyInterestPercent / 100;
            uint accountInterest = requiredDataArray[index].reward * accountInterestPercent / 100;
            uint coOwnerInterest = requiredDataArray[index].reward * coOwnerInterestPercent / 100;

            kimlicToken.transfer(account, accountInterest);
            kimlicToken.transfer(account, coOwnerInterest);
            kimlicToken.transfer(account, communityTokenWalletInterest);
            kimlicToken.transfer(owner, attestationPartyInterest);
        }
    }
}