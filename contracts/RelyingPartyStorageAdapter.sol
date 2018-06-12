pragma solidity ^0.4.23;


import "./BaseStorage.sol";
import "./WithKimlicContext.sol";
import "./KimlicContractsContext.sol";
import "./BasePartyStorageAdapter.sol";

contract RelyingPartyStorageAdapter is BasePartyStorageAdapter {

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
        return getContext().getRelyingPartyStorage();
    }
    
    /// Modifiers ///
    modifier accessRestriction() {//TODO write restrictions
        _;
    }
}