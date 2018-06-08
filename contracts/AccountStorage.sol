pragma solidity ^0.4.23;


import "./KimlicContractsContext.sol";
import "./BaseStorage.sol";
import "./WithKimlicContext.sol";

contract AccountStorage is BaseStorage, WithKimlicContext {
    
    /// constructors ///
    constructor (address contextStorage) public WithKimlicContext(contextStorage) {
    }

    /// modifiers ///
    modifier accessRestriction() {
        KimlicContractsContext context = getContext();
        require(msg.sender == address(context.getAccountStorageAdapter()) || msg.sender == context.owner());
        _;
    }

}