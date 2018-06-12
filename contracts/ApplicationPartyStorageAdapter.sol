pragma solidity ^0.4.23;


import "./BaseStorage.sol";
import "./WithKimlicContext.sol";
import "./BaseStorage.sol";
import "./BasePartyStorageAdapter.sol";

contract ApplicationPartyStorageAdapter is BasePartyStorageAdapter {

    /// private attributes ///
    string private constant legalName = "legalName";
    string private constant shortName = "shortName";
    string private constant businessArea = "businessArea";
    string private constant legalResidenceCountry = "legalResidenceCountry";
    string private constant website = "website";
    string private constant dataPrivacyUrl = "dataPrivacyUrl";


    /// constructors ///
    constructor (address contextStorage) public BasePartyStorageAdapter(contextStorage) {
        
    }

    /// internal methods ///
    function getStorage() view internal returns (BaseStorage) {
        getContext().getApplicationPartyStorage();
    }
    
    /// Modifiers ///
    modifier accessRestriction() {//TODO write restrictions
        _;
    }
}