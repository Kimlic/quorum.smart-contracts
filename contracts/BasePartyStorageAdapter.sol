pragma solidity ^0.4.23;


import "./BaseStorage.sol";
import "./WithKimlicContext.sol";
import "./BaseStorage.sol";
import "./KimlicContractsContext.sol";

contract BasePartyStorageAdapter is WithKimlicContext {

    /// private attributes ///
    string private constant legalNameKey = "legalName";
    string private constant shortNameKey = "shortName";
    string private constant businessAreaKey = "businessArea";
    string private constant legalResidenceCountryKey = "legalResidenceCountry";
    string private constant websiteKey = "website";
    string private constant dataPrivacyUrlKey = "dataPrivacyUrl";


    /// constructors ///
    constructor (address contextStorage) public WithKimlicContext(contextStorage) {
        
    }

    /// public methods ///

    /* Setters */
    function setLegalName(string value) public {
        setStringValue(msg.sender, value, legalNameKey);
    }
    
    function setShortName(string value) public {
        setStringValue(msg.sender, value, shortNameKey);
    }
    
    function setBusinessArea(string value) public {
        setStringValue(msg.sender, value, businessAreaKey);
    }
    
    function setLegalResidenceCountry(string value) public {
        setStringValue(msg.sender, value, legalResidenceCountryKey);
    }
    
    function setWebsite(string value) public {
        setStringValue(msg.sender, value, websiteKey);
    }
    
    function setDataPrivacyUrl(string value) public {
        setStringValue(msg.sender, value, dataPrivacyUrlKey);
    }

    /* Getters */
    function getLegalName(address party) public view getAccessRestriction(party) returns(string) {
        return getStringValue(party, legalNameKey);
    }
    
    function getShortName(address party) public view getAccessRestriction(party) returns(string) {
        return getStringValue(party, shortNameKey);
    }
    
    function getBusinessArea(address party) public view getAccessRestriction(party) returns(string) {
        return getStringValue(party, businessAreaKey);
    }
    
    function getLegalResidenceCountry(address party) public view getAccessRestriction(party) returns(string) {
        return getStringValue(party, legalResidenceCountryKey);
    }
    
    function getWebsite(address party) public view getAccessRestriction(party) returns(string) {
        return getStringValue(party, websiteKey);
    }
    
    function getDataPrivacyUrl(address party) public view getAccessRestriction(party) returns(string) {
        return getStringValue(party, dataPrivacyUrlKey);
    }

    /// private methods ///
    function setStringValue(address party, string value, string fieldName) private {
        bytes memory key = abi.encode(party, fieldName);
        getStorage().setString(keccak256(key), value);
    }

    function getStringValue(address party, string fieldName) private view returns(string) {
        bytes memory key = abi.encode(party, fieldName);
        return getStorage().getString(keccak256(key));
    }

    /// internal methods ///
    function getStorage() view internal returns (BaseStorage);


    modifier getAccessRestriction(address party) {
        _;
    }
}