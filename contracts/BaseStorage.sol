pragma solidity ^0.4.23;

/// @title Data storage layer implementation
/// @author Bohdan Grytsenko
/// @notice Core contract which implements data storage for every party using our product - User, Attestation party (AP), Relying party (RP)
contract BaseStorage {
    /// internal attributes ///
    mapping(bytes32 => uint256)    internal uIntStorage;
    mapping(bytes32 => string)     internal stringStorage;
    mapping(bytes32 => address)    internal addressStorage;
    mapping(bytes32 => bytes32)    internal bytes32Storage;
    mapping(bytes32 => bool)       internal boolStorage;
    mapping(bytes32 => int256)     internal intStorage;

    /// modifiers ///
    modifier accessRestriction() {
        _;
    }

    /**** Get Methods ***********/
    
    /// @notice accessor for address attribute type
    /// @param _key storage key value
    function getAddress(bytes32 _key) external view accessRestriction() returns (address) {
        return addressStorage[_key];
    }

    /// @notice accessor for uint attribute type
    /// @param _key storage key value
    function getUint(bytes32 _key) external view accessRestriction() returns (uint) {
        return uIntStorage[_key];
    }

    /// @notice accessor for string attribute type
    /// @param _key storage key value
    function getString(bytes32 _key) external view accessRestriction() returns (string) {
        return stringStorage[_key];
    } 

    /// @notice accessor for bytes32 attribute type
    /// @param _key storage key value
    function getBytes32(bytes32 _key) external view accessRestriction() returns (bytes32) {
        return bytes32Storage[_key];
    }

    /// @notice accessor for bool attribute type
    /// @param _key storage key value
    function getBool(bytes32 _key) external view accessRestriction() returns (bool) {
        return boolStorage[_key];
    }

    /// @notice accessor for int attribute type
    /// @param _key storage key value
    function getInt(bytes32 _key) external view accessRestriction() returns (int) {
        return intStorage[_key];
    }


    /**** Set Methods ***********/


    /// @notice modifier for address attribute type
    /// @param _key storage key value
    function setAddress(bytes32 _key, address _value) external accessRestriction() {
        addressStorage[_key] = _value;
    }

    /// @notice modifier for uint attribute type
    /// @param _key storage key value
    function setUint(bytes32 _key, uint _value) external accessRestriction() {
        uIntStorage[_key] = _value;
    }

    /// @notice modifier for string attribute type
    /// @param _key storage key value
    function setString(bytes32 _key, string _value) external accessRestriction() {
        stringStorage[_key] = _value;
    }

    /// @notice modifier for bytes32 attribute type
    /// @param _key storage key value
    function setBytes32(bytes32 _key, bytes32 _value) external accessRestriction() {
        bytes32Storage[_key] = _value;
    }
    
    /// @notice modifier for bool attribute type
    /// @param _key storage key value
    function setBool(bytes32 _key, bool _value) external accessRestriction() {
        boolStorage[_key] = _value;
    }
    
    /// @notice modifier for int attribute type
    /// @param _key storage key value
    function setInt(bytes32 _key, int _value) external accessRestriction() {
        intStorage[_key] = _value;
    }


    /**** Delete Methods ***********/
    
    /// @notice removal of address attribute type
    /// @param _key storage key value
    function deleteAddress(bytes32 _key) external accessRestriction() {
        delete addressStorage[_key];
    }

    /// @notice removal of bytes32 attribute type
    /// @param _key storage key value
    function deleteUint(bytes32 _key) external accessRestriction() {
        delete uIntStorage[_key];
    }

    /// @notice removal of string attribute type
    /// @param _key storage key value
    function deleteString(bytes32 _key) external accessRestriction() {
        delete stringStorage[_key];
    }

    /// @notice removal of bytes32 attribute type
    /// @param _key storage key value
    function deleteBytes32(bytes32 _key) external accessRestriction() {
        delete bytes32Storage[_key];
    }
    
    /// @notice removal of bool attribute type
    /// @param _key storage key value
    function deleteBool(bytes32 _key) external accessRestriction() {
        delete boolStorage[_key];
    }
    
    /// @notice removal of int attribute type
    /// @param _key storage key value
    function deleteInt(bytes32 _key) external accessRestriction() {
        delete intStorage[_key];
    }

}