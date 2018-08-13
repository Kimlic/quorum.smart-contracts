pragma solidity ^0.4.23;


import "./KimlicContractsContext.sol";
import "./BaseStorage.sol";
import "./WithKimlicContext.sol";

/// @title RelyingPartyStorage
/// @notice Contract which serves as access control layer between BaseStorage and RelyingPartyStorageAdapter
/// @author Bohdan Grytsenko
contract RelyingPartyStorage is BaseStorage, WithKimlicContext {
    
    /// constructors ///
    constructor (address contextStorage) public WithKimlicContext(contextStorage) {
    }

    /// modifiers ///
    modifier accessRestriction() {
        KimlicContractsContext context = getContext();
        require(msg.sender == address(context.getRelyingPartyStorageAdapter()) || msg.sender == context.owner());
        _;
    }

}