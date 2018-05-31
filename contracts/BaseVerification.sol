pragma solidity ^0.4.23;


import "./Ownable.sol";
import "./WithKimlicContext.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorageAdapter.sol";

contract BaseVerification is WithKimlicContext, Ownable {
    AccountStorageAdapter.AccountFieldName public accountFieldName;
    address internal _accountAddress;
    uint internal _rewardAmount;

    constructor(KimlicContractsContext context, address account, uint rewardAmount, AccountStorageAdapter.AccountFieldName fieldName) public
        WithKimlicContext(context) {

        _accountAddress = account;
        _rewardAmount = rewardAmount;
        accountFieldName = fieldName;
    }

    function setVerificationResult(bool verificationResult) public {
        require(_context.kimlicToken().balanceOf(address(this)) == _rewardAmount);

        _context.kimlicToken().transfer(owner, _rewardAmount);

        _context.accountStorageAdapter().setVerificationResult(
            _accountAddress, accountFieldName, verificationResult, owner, block.timestamp);
    }
}