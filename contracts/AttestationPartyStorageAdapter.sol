pragma solidity ^0.4.23;


import "./BaseStorage.sol";
import "./WithKimlicContext.sol";
import "./BaseStorage.sol";
import "./BasePartyStorageAdapter.sol";

contract AttestationPartyStorageAdapter is BasePartyStorageAdapter {

    /// private attributes ///

    /// constructors ///
    constructor (address contextStorage) public BasePartyStorageAdapter(contextStorage) {
        
    }

    /// internal methods ///
    function getStorage() view internal returns (BaseStorage) {
        getContext().getAttestationPartyStorage();
    }
    
    /// Modifiers ///
    modifier accessRestriction() {//TODO write restrictions
        _;
    }
}