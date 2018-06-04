pragma solidity ^0.4.23;


import "./Ownable.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorageAdapter.sol";

contract BaseVerification is Ownable {
    AccountStorageAdapter.AccountFieldName public accountFieldName;
    address public coOwner;
    bool public isVerified;

    address internal _accountAddress;
    uint internal _rewardAmount;
    KimlicContractsContext internal _context;

    constructor(
        KimlicContractsContext context, address account, uint rewardAmount, address coOwnerAddress,
        AccountStorageAdapter.AccountFieldName fieldName) public {

        coOwner = coOwnerAddress;
        _context = context;
        _accountAddress = account;
        _rewardAmount = rewardAmount;
        accountFieldName = fieldName;
    }

    function setVerificationResult(bool verificationResult) public {
        require(_context.kimlicToken().balanceOf(address(this)) == _rewardAmount);
        isVerified = verificationResult;

        _context.kimlicToken().transfer(owner, _rewardAmount);

        _context.accountStorageAdapter().setVerificationResult(
            _accountAddress, accountFieldName, verificationResult, address(this), block.timestamp);
    }
}
