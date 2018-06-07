pragma solidity ^0.4.23;


import "./KimlicContractsContext.sol";

contract BaseStorage {
    /// private attributes ///
    mapping(bytes32 => uint256)    private uIntStorage;
    mapping(bytes32 => string)     private stringStorage;
    mapping(bytes32 => address)    private addressStorage;
    mapping(bytes32 => bytes32)    private bytes32Storage;
    mapping(bytes32 => bool)       private boolStorage;
    mapping(bytes32 => int256)     private intStorage;

    KimlicContractsContext private _context;

    /// constructors ///
    constructor (KimlicContractsContext context) public {
        _context = context;
    }

    /// modifiers ///
    modifier accountStorageAdapterOnly() {
        require(msg.sender == address(_context.accountStorageAdapter()) || msg.sender == _context.owner());
        _;
    }

    /// public methods ///

    /**** Get Methods ***********/
    
    /// @param _key The key for the record
    function getAddress(bytes32 _key) external view accountStorageAdapterOnly() returns (address) {
        return addressStorage[_key];
    }

    /// @param _key The key for the record
    function getUint(bytes32 _key) external view accountStorageAdapterOnly() returns (uint) {
        return uIntStorage[_key];
    }

    /// @param _key The key for the record
    function getString(bytes32 _key) external view accountStorageAdapterOnly() returns (string) {
        return stringStorage[_key];
    } 

    /// @param _key The key for the record
    function getBytes32(bytes32 _key) external view accountStorageAdapterOnly() returns (bytes32) {
        return bytes32Storage[_key];
    }

    /// @param _key The key for the record
    function getBool(bytes32 _key) external view accountStorageAdapterOnly() returns (bool) {
        return boolStorage[_key];
    }

    /// @param _key The key for the record
    function getInt(bytes32 _key) external view accountStorageAdapterOnly() returns (int) {
        return intStorage[_key];
    }


    /**** Set Methods ***********/


    /// @param _key The key for the record
    function setAddress(bytes32 _key, address _value) external accountStorageAdapterOnly() {
        addressStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setUint(bytes32 _key, uint _value) external accountStorageAdapterOnly() {
        uIntStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setString(bytes32 _key, string _value) external accountStorageAdapterOnly() {
        stringStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setBytes32(bytes32 _key, bytes32 _value) external accountStorageAdapterOnly() {
        bytes32Storage[_key] = _value;
    }
    
    /// @param _key The key for the record
    function setBool(bytes32 _key, bool _value) external accountStorageAdapterOnly() {
        boolStorage[_key] = _value;
    }
    
    /// @param _key The key for the record
    function setInt(bytes32 _key, int _value) external accountStorageAdapterOnly() {
        intStorage[_key] = _value;
    }


    /**** Delete Methods ***********/
    
    /// @param _key The key for the record
    function deleteAddress(bytes32 _key) external accountStorageAdapterOnly() {
        delete addressStorage[_key];
    }

    /// @param _key The key for the record
    function deleteUint(bytes32 _key) external accountStorageAdapterOnly() {
        delete uIntStorage[_key];
    }

    /// @param _key The key for the record
    function deleteString(bytes32 _key) external accountStorageAdapterOnly() {
        delete stringStorage[_key];
    }

    /// @param _key The key for the record
    function deleteBytes32(bytes32 _key) external accountStorageAdapterOnly() {
        delete bytes32Storage[_key];
    }
    
    /// @param _key The key for the record
    function deleteBool(bytes32 _key) external accountStorageAdapterOnly() {
        delete boolStorage[_key];
    }
    
    /// @param _key The key for the record
    function deleteInt(bytes32 _key) external accountStorageAdapterOnly() {
        delete intStorage[_key];
    }

}