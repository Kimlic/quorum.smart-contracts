pragma solidity ^0.4.23;


import "./WithKimlicContext.sol";
import "./Ownable.sol";
import "./KimlicContractsContext.sol";

contract AccountStorageAdapter is Ownable, WithKimlicContext {

    /// public attributes ///
    mapping (uint=>string) AccountFieldNames;
    
    /// private attributes ///
    KimlicContractsContext private _context;
    string constant lengthCaption = "length"; 

    /// Structures ///

    struct Meta {
        string data;
        string objectType;
        string keys;
        bool isVerified;
        address verifiedBy;
        uint256 verifiedAt;
    }

    /*struct Account {
        Meta identity;
        Meta phone;
        Meta email;
        Meta[] documents;//TODO: Return to this part on 2nd sprint
        Meta[] addresses;
        bytes32 device;
    }*/

    /// Enums ///

    enum AccountFieldName { Email, Phone, Identity, Device, Documents, Addresses }

    enum MetaFieldName { Data, ObjectType, Keys, IsVerified, VerifiedBy, VerifiedAt }

    /// Constructors ///

    constructor (KimlicContractsContext context) public WithKimlicContext(context) {
    }
    
    /// public methods ///

    function setAccountData(
        address accountAddress, string identityHash,
        string phoneHash, string emailHash, bytes32 deviceHash) public {
        
        updateAccountField(accountAddress, emailHash, AccountFieldName.Email);
        updateAccountField(accountAddress, phoneHash, AccountFieldName.Phone);
        updateAccountField(accountAddress, identityHash, AccountFieldName.Identity);

        bytes memory deviceHashKey = abi.encode(accountAddress, convertAccountFieldNameToString(AccountFieldName.Device));
        bytes32 storedDeviceHash = _context.accountStorage().getBytes32(keccak256(deviceHashKey));
        if(storedDeviceHash != deviceHash) {
            _context.accountStorage().setBytes32(keccak256(deviceHashKey), deviceHash);
        }
    }

    function addAddress(string data, string objectType, string keys) public {
        addNewFieldItem(msg.sender, AccountFieldName.Addresses, data, objectType, keys);
    }

    function addDocument(string data, string objectType, string keys) public {
        addNewFieldItem(msg.sender, AccountFieldName.Documents, data, objectType, keys);
    }

    
    function getAccountData(address accountAddress, AccountFieldName accountFieldName)
        public view returns(string data, string objectType, string keys,
            bool isVerified, address verifiedBy, uint256 verifiedAt) {

        return getAccountData(accountAddress, accountFieldName, 0);
    }

    function getAccountData(address accountAddress, AccountFieldName accountFieldName, uint index)
        public view returns(string data, string objectType, string keys,
            bool isVerified, address verifiedBy, uint256 verifiedAt) {

        string memory fieldName = convertAccountFieldNameToString(accountFieldName);

        bytes memory dataKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.Data));
        data = _context.accountStorage().getString(keccak256(dataKey));
        
        bytes memory objectTypeKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.ObjectType));
        objectType = _context.accountStorage().getString(keccak256(objectTypeKey));
        
        bytes memory keysKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.Keys));
        keys = _context.accountStorage().getString(keccak256(keysKey));
        
        bytes memory isVerifiedKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.IsVerified));
        isVerified = _context.accountStorage().getBool(keccak256(isVerifiedKey));
        
        bytes memory verifiedByKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.VerifiedBy));
        verifiedBy = _context.accountStorage().getAddress(keccak256(verifiedByKey));
        
        bytes memory verifiedAtKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.VerifiedAt));
        verifiedAt = _context.accountStorage().getUint(keccak256(verifiedAtKey));
    }

    function setVerificationResult(
        address accountAddress, AccountFieldName accountFieldName,
        bool isVerified, address verifiedBy, uint verifiedAt) public {
        
        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        setVerificationResult(accountAddress, accountFieldName, index, isVerified, verifiedBy, verifiedAt);
    }

    function setVerificationResult(
        address accountAddress, AccountFieldName accountFieldName, uint index,
        bool isVerified, address verifiedBy, uint verifiedAt) public {
        
        string memory fieldName = convertAccountFieldNameToString(accountFieldName);

        bytes memory isVerifiedKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.IsVerified));
        _context.accountStorage().setBool(keccak256(isVerifiedKey), isVerified);
        
        bytes memory verifiedByKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.VerifiedBy));
        _context.accountStorage().setAddress(keccak256(verifiedByKey), verifiedBy);
        
        bytes memory verifiedAtKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.VerifiedAt));
        _context.accountStorage().setUint(keccak256(verifiedAtKey), verifiedAt);
    }
    
    function getFieldHistoryLength(address accountAddress, AccountFieldName accountFieldName) public view returns(uint length){
        bytes memory fieldHistoryLengthKey = abi.encode(accountAddress, accountFieldName, lengthCaption);
        length = _context.accountStorage().getUint(keccak256(fieldHistoryLengthKey));
    }
    
    /// private methods ///

    function updateAccountField(address accountAddress, string data, AccountFieldName accountFieldName) private {
        string memory fieldName = convertAccountFieldNameToString(accountFieldName);

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);

        bytes memory dataKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.Data));
        string memory storedData = _context.accountStorage().getString(keccak256(dataKey));
        if (!isEqualStrings(storedData, data)) {
            addNewFieldItem(accountAddress, accountFieldName, data, "", "");
        }
    }


    function addNewFieldItem(
        address accountAddress, AccountFieldName accountFieldName,
        string data, string objectType, string keys) private {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName) + 1;
        
        string memory fieldName = convertAccountFieldNameToString(accountFieldName);

        bytes memory newDataKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.Data));
        _context.accountStorage().setString(keccak256(newDataKey), data);

        bytes memory objectTypeKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.ObjectType));
        _context.accountStorage().setString(keccak256(objectTypeKey), data);

        bytes memory keysKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.Keys));
        _context.accountStorage().setString(keccak256(keysKey), data);
        
        bytes memory fieldHistoryLengthKey = abi.encode(accountAddress, accountFieldName, lengthCaption);
        _context.accountStorage().setUint(keccak256(fieldHistoryLengthKey), index);
    }
      
    function convertAccountFieldNameToString(AccountFieldName accountFieldName) private pure returns(string memory enumCaption) {
        if (accountFieldName == AccountFieldName.Email) {
            enumCaption = "email";
        }
        else if (accountFieldName == AccountFieldName.Phone) {
            enumCaption = "phone";
        }
        else if (accountFieldName == AccountFieldName.Identity) {
            enumCaption = "identity";
        }
        else if (accountFieldName == AccountFieldName.Device) {
            enumCaption = "device";
        }
        else if (accountFieldName == AccountFieldName.Documents) {
            enumCaption = "documents";
        }
        else if (accountFieldName == AccountFieldName.Addresses) {
            enumCaption = "addresses";
        }
        else {
            require(false);
        }
    }
      
    function convertMetaFieldNameToString(MetaFieldName metaFieldName) private pure returns(string memory enumCaption) {        
        if (metaFieldName == MetaFieldName.Data) {
            enumCaption = "data";
        }
        else if (metaFieldName == MetaFieldName.ObjectType) {
            enumCaption = "objectType";
        }
        else if (metaFieldName == MetaFieldName.Keys) {
            enumCaption = "keys";
        }
        else if (metaFieldName == MetaFieldName.IsVerified) {
            enumCaption = "isVerified";
        }
        else if (metaFieldName == MetaFieldName.VerifiedAt) {
            enumCaption = "verifiedAt";
        }
        else if (metaFieldName == MetaFieldName.VerifiedBy) {
            enumCaption = "verifiedBy";
        }
        else {
            require(false);
        }
    }

    function isEqualStrings(string leftValue, string rightValue) private pure returns(bool isEqual){
        isEqual = keccak256(bytes(leftValue)) == keccak256(bytes(rightValue));
    }
}
