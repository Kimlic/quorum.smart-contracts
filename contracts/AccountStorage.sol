pragma solidity ^0.4.23;


import "./KimlicContractsContext.sol";
import "./BaseStorage.sol";

contract AccountStorage is BaseStorage {
    
    KimlicContractsContext private _context;

    /// constructors ///
    constructor (KimlicContractsContext context) public {
        _context = context;
    }

    /// modifiers ///
    modifier accessRestriction() {
        require(msg.sender == address(_context.accountStorageAdapter()) || msg.sender == _context.owner());
        _;
    }

}