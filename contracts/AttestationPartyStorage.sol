pragma solidity ^0.4.23;


import "./KimlicContractsContext.sol";
import "./BaseStorage.sol";
import "./WithKimlicContext.sol";

/// @title AttestationPartyStorage
/// @notice Contract which serves as access control layer between BaseStorage and AttestationPartyStorageAdapter
/// @author Bohdan Grytsenko
contract AttestationPartyStorage is BaseStorage, WithKimlicContext {
    
    /// constructors ///
    constructor (address contextStorage) public WithKimlicContext(contextStorage) {
    }

    /// modifiers ///
    modifier accessRestriction() {
        KimlicContractsContext context = getContext();
        require(msg.sender == address(context.getAttestationPartyStorageAdapter()) || msg.sender == context.owner());
        _;
    }

}