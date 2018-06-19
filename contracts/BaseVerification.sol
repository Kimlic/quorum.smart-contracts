pragma solidity ^0.4.23;


import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorageAdapter.sol";
import "./WithKimlicContext.sol";
import "./KimlicToken.sol";

contract BaseVerification is Ownable, WithKimlicContext {
    AccountStorageAdapter.AccountFieldName public accountFieldName;
    address public coOwner;
    bool public isVerified;
    uint public dataIndex;
    address public verificator;
    address public accountAddress;

    uint internal _rewardAmount;

    constructor(
        address contextStorage, uint rewardAmount, address account, address coOwnerAddress, uint index, address verificatorAddress,
        AccountStorageAdapter.AccountFieldName fieldName) public WithKimlicContext(contextStorage) Ownable() {

        coOwner = coOwnerAddress;
        accountAddress = account;
        dataIndex = index;
        verificator = verificatorAddress;
        _rewardAmount = rewardAmount;
        accountFieldName = fieldName;
    }

    function setVerificationResult(bool verificationResult) public onlyOwner() {
        KimlicContractsContext context = getContext();
        KimlicToken token = context.getKimlicToken();
        require(token.balanceOf(address(this)) == _rewardAmount);
        
        isVerified = verificationResult;

        token.transfer(owner, _rewardAmount);

        context.getAccountStorageAdapter().setAccountFieldVerificationData(
            accountAddress, accountFieldName, verificationResult, address(this), block.timestamp);
    }

    function getData() view public onlyOwner() returns (string data, string objectType) {
        return getContext().getAccountStorageAdapter().getAccountFieldMainData(accountAddress, accountFieldName, dataIndex);
    }
}
