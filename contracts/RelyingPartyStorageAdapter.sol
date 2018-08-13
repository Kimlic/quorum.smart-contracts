pragma solidity ^0.4.23;


import "./BaseStorage.sol";
import "./WithKimlicContext.sol";
import "./KimlicContractsContext.sol";
import "./BasePartyStorageAdapter.sol";

/// @title Relying party profiles storage and management
/// @author Bohdan Grytsenko
/// @notice Single point to manage RP profiles
contract RelyingPartyStorageAdapter is BasePartyStorageAdapter {

    /// private attributes ///

    /// constructors ///
    constructor (address contextStorage) public BasePartyStorageAdapter(contextStorage) {
        
    }

    /// internal methods ///
    function getStorage() view internal returns (BaseStorage) {
        return getContext().getRelyingPartyStorage();
    }
    
    /// Modifiers ///
}