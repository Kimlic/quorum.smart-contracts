pragma solidity ^0.4.23;


import "./BaseStorage.sol";
import "./WithKimlicContext.sol";
import "./BaseStorage.sol";

contract BasePartyStorageAdapter is WithKimlicContext {

    /// private attributes ///
    string private constant legalName = "legalName";
    string private constant shortName = "shortName";
    string private constant businessArea = "businessArea";
    string private constant legalResidenceCountry = "legalResidenceCountry";
    string private constant website = "website";
    string private constant dataPrivacyUrl = "dataPrivacyUrl";


    /// constructors ///
    constructor (address contextStorage) public WithKimlicContext(contextStorage) {
        
    }

    /// public methods ///

    /* Setters */
    function setLegalName(address party, string value) public accessRestriction() {
        setStringValue(party, value, legalName);
    }
    
    function setShortName(address party, string value) public accessRestriction() {
        setStringValue(party, value, shortName);
    }
    
    function setBusinessArea(address party, string value) public accessRestriction() {
        setStringValue(party, value, businessArea);
    }
    
    function setLegalResidenceCountry(address party, string value) public accessRestriction() {
        setStringValue(party, value, legalResidenceCountry);
    }
    
    function setWebsite(address party, string value) public accessRestriction() {
        setStringValue(party, value, website);
    }
    
    function setDataPrivacyUrl(address party, string value) public accessRestriction() {
        setStringValue(party, value, dataPrivacyUrl);
    }

    /* Getters */
    function getLegalName(address party) public accessRestriction() view {
        getStringValue(party, legalName);
    }
    
    function getShortName(address party) public view accessRestriction() {
        getStringValue(party, shortName);
    }
    
    function getBusinessArea(address party) public view accessRestriction() {
        getStringValue(party, businessArea);
    }
    
    function getLegalResidenceCountry(address party) public view accessRestriction() {
        getStringValue(party, legalResidenceCountry);
    }
    
    function getWebsite(address party) public view accessRestriction() {
        getStringValue(party, website);
    }
    
    function getDataPrivacyUrl(address party) public view accessRestriction() {
        getStringValue(party, dataPrivacyUrl);
    }

    /// private methods ///
    function setStringValue(address party, string value, string columnName) private {
        bytes memory key = abi.encode(party, columnName);
        getStorage().setString(keccak256(key), value);
    }

    function getStringValue(address party, string columnName) private view {
        bytes memory key = abi.encode(party, columnName);
        getStorage().getString(keccak256(key));
    }

    /// internal methods ///
    function getStorage() view internal returns (BaseStorage);

    /// Modifiers ///
    modifier accessRestriction() {
        _;
    }
}