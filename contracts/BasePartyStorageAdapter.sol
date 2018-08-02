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
    function setLegalName(address party, string value) public setterAccessRestriction(party) {
        setStringValue(party, value, legalNameKey);
    }
    
    function setShortName(address party, string value) public setterAccessRestriction(party) {
        setStringValue(party, value, shortNameKey);
    }
    
    function setBusinessArea(address party, string value) public setterAccessRestriction(party) {
        setStringValue(party, value, businessAreaKey);
    }
    
    function setLegalResidenceCountry(address party, string value) public setterAccessRestriction(party) {
        setStringValue(party, value, legalResidenceCountryKey);
    }
    
    function setWebsite(address party, string value) public setterAccessRestriction(party) {
        setStringValue(party, value, websiteKey);
    }
    
    function setDataPrivacyUrl(address party, string value) public setterAccessRestriction(party) {
        setStringValue(party, value, dataPrivacyUrlKey);
    }

    /* Getters */
    function getLegalName(address party) public view  returns(string) {
        return getStringValue(party, legalNameKey);
    }
    
    function getShortName(address party) public view  returns(string) {
        return getStringValue(party, shortNameKey);
    }
    
    function getBusinessArea(address party) public view  returns(string) {
        return getStringValue(party, businessAreaKey);
    }
    
    function getLegalResidenceCountry(address party) public view  returns(string) {
        return getStringValue(party, legalResidenceCountryKey);
    }
    
    function getWebsite(address party) public view  returns(string) {
        return getStringValue(party, websiteKey);
    }
    
    function getDataPrivacyUrl(address party) public view  returns(string) {
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

    modifier setterAccessRestriction(address party) {
        require(msg.sender == party || msg.sender == getContext().owner());
        _;
    }
}