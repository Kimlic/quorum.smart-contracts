pragma solidity ^0.4.23;


import "./Ownable.sol";
import "./WithKimlicContext.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorageAdapter.sol";

contract ProvisioningContract is WithKimlicContext, Ownable {
    address public relyingParty;
    address public account;
    Status public status;

    RequiredData[] private requiredDataArray;
    uint private expectedReward;

    struct RequiredData {
        AccountStorageAdapter.AccountFieldName fieldName;
        uint index;
    }

    enum Status { DataInitialization, WaitingForTokens, Finished }

    constructor (KimlicContractsContext context, address accountAddress) public WithKimlicContext(context) {
        account = accountAddress;
        status = Status.DataInitialization;
    }

    function addRequiredData(AccountStorageAdapter.AccountFieldName accountFieldName, uint index) public {
        requiredDataArray.push(RequiredData({fieldName: accountFieldName, index: index}));
        expectedReward += _context.provisioningPrice().getPrice(accountFieldName); //TODO need to rework this logic later
    }
    
    function setNextStatus() public {
        if (status == Status.DataInitialization) {
            require(requiredDataArray.length > 0);
            status = Status.WaitingForTokens;
        } 
        else if (status == Status.WaitingForTokens) {
            require(_context.kimlicToken().balanceOf(address(this)) == expectedReward);
            status = Status.Finished;

            uint userReward = expectedReward / 2;
            expectedReward -= userReward;
            _context.kimlicToken().transfer(owner, userReward);
            _context.kimlicToken().transfer(owner, expectedReward);//TODO change to real reward system
        }
    }

    function getData(uint requiredDataArrayIndex) view public onlyOwner() returns(string data, string objectType, string keys,
            bool isVerified, address verifiedBy, uint256 verifiedAt) {

        RequiredData storage requiredData = requiredDataArray[requiredDataArrayIndex];
        
        return _context.accountStorageAdapter().getAccountData(account, requiredData.fieldName, requiredData.index);
    }
    
}