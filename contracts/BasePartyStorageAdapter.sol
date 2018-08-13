pragma solidity ^0.4.23;


import "./BaseStorage.sol";
import "./WithKimlicContext.sol";
import "./BaseStorage.sol";
import "./KimlicContractsContext.sol";

/// @title Attestation party profile storage and management
/// @author Bohdan Grytsenko
/// @notice This is layer over BaseStorage which serves as management point for Attestation party profile, which contains legal & contact information
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

    /// @notice sets party legal name
    /// @param party AP account address
    /// @param value legal address value
    function setLegalName(address party, string value) public setterAccessRestriction(party) {
        setStringValue(party, value, legalNameKey);
    }
    
    /// @notice sets party short name
    /// @param party AP account address
    /// @param value short name value    
    function setShortName(address party, string value) public setterAccessRestriction(party) {
        setStringValue(party, value, shortNameKey);
    }
    
    /// @notice sets party business area
    /// @param party AP account address
    /// @param value business area value
    function setBusinessArea(address party, string value) public setterAccessRestriction(party) {
        setStringValue(party, value, businessAreaKey);
    }
    
    /// @notice sets party legal residence country
    /// @param party AP account address
    /// @param value country value    
    function setLegalResidenceCountry(address party, string value) public setterAccessRestriction(party) {
        setStringValue(party, value, legalResidenceCountryKey);
    }
    
    /// @notice sets party website address
    /// @param party AP account address
    /// @param value website address value      
    function setWebsite(address party, string value) public setterAccessRestriction(party) {
        setStringValue(party, value, websiteKey);
    }
    
    /// @notice sets party data privacy policy url
    /// @param party AP account address
    /// @param value policy url value      
    function setDataPrivacyUrl(address party, string value) public setterAccessRestriction(party) {
        setStringValue(party, value, dataPrivacyUrlKey);
    }

    /* Getters */

    /// @notice gets party legal name
    /// @param party AP account address
    /// @return value legal address value    
    function getLegalName(address party) public view  returns(string) {
        return getStringValue(party, legalNameKey);
    }
    
    /// @notice gets party short name
    /// @param party AP account address
    /// @return short name value      
    function getShortName(address party) public view  returns(string) {
        return getStringValue(party, shortNameKey);
    }
    
    /// @notice gets party business area
    /// @param party AP account address
    /// @return business area value    
    function getBusinessArea(address party) public view  returns(string) {
        return getStringValue(party, businessAreaKey);
    }
    
    /// @notice gets party legal residence country
    /// @param party AP account address
    /// @return country value      
    function getLegalResidenceCountry(address party) public view  returns(string) {
        return getStringValue(party, legalResidenceCountryKey);
    }
    
    /// @notice gets party website address
    /// @param party AP account address
    /// @return website address value     
    function getWebsite(address party) public view  returns(string) {
        return getStringValue(party, websiteKey);
    }
    
    /// @notice gets party data privacy policy url
    /// @param party AP account address
    /// @return value policy url value      
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