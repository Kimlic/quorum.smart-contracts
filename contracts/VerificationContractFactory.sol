pragma solidity ^0.4.23;


import "./Ownable.sol";
import "./BaseVerification.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicContractsContext.sol";

contract VerificationContractFactory {
    /// public attributes ///
    mapping(address=>bool) public createdContracts;

    /// private attributes ///
    uint private _rewardAmount;
    KimlicContractsContext private _context;

    /// Constructors ///
    constructor(KimlicContractsContext context) public {
        _context = context;
        _rewardAmount = 1;
    }

    /// public methods ///
    function createEmailVerification(address account, address coOwnerAddress)
            public returns(BaseVerification createdContract) {

        createdContract = new BaseVerification(_context, account,
            _rewardAmount, coOwnerAddress, AccountStorageAdapter.AccountFieldName.Email);
        createdContract.transferOwnership(msg.sender);
        createdContracts[address(createdContract)] = true;
    }

    function createPhoneVerification(address account, address coOwnerAddress)
            public returns(BaseVerification createdContract) {

        createdContract = new BaseVerification(_context, account,
            _rewardAmount, coOwnerAddress, AccountStorageAdapter.AccountFieldName.Phone);
        createdContract.transferOwnership(msg.sender);
        createdContracts[address(createdContract)] = true;
    }
}
