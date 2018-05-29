pragma solidity 0.4.24;

import "./Ownable.sol";
import "./BaseStorage.sol";

contract AccountStorageAdapter is Ownable {

    /// public attributes ///

    
    /// private attributes ///
    BaseStorage private storageContract;

    /// Structures ///

    struct Meta {
        string data;
        string objectType;
        string keys;
        bool isVerified;
        address verifiedBy;
        uint256 verifiedAt;
    }

    struct Account {
        Meta identity;
        Meta phone;
        Meta email;
        //Meta[] documents;//TODO: Return to this part on 2nd sprint
        //Meta[] addresses;
        bytes32 device;
    }

    /// Enums ///

    enum AccountFieldName { Email, Phone, Identity, Device }

    enum MetaFieldName { Data, ObjectType, Keys, IsVerified, VerifiedBy, VerifiedAt }

    /// Constructors ///

    constructor (BaseStorage storageAddress) public {
        storageContract = storageAddress;
    }
    
    /// public methods ///

    function setAccountData(
        address accountAddress, string identityHash,
        string phoneHash, string emailHash, bytes32 deviceHash) public {
        
        updateMetaInfo(accountAddress, emailHash, AccountFieldName.Email);
        updateMetaInfo(accountAddress, phoneHash, AccountFieldName.Phone);
        updateMetaInfo(accountAddress, identityHash, AccountFieldName.Identity);

        
        bytes32 storedDeviceHash = storageContract.getBytes32(keccak256(
            abi.encode(accountAddress, convertAccountFieldNameToString(AccountFieldName.Device))));
        if(storedDeviceHash != deviceHash) {
            storageContract.setBytes32(
                keccak256(abi.encode(accountAddress, convertAccountFieldNameToString(AccountFieldName.Device))), deviceHash);
        }
    }

    function getAccountData(address accountAddress, AccountFieldName accountFieldName)
        public view returns(string data, string objectType, string keys,
            bool isVerified, address verifiedBy, uint256 verifiedAt) {

        string memory fieldName = convertAccountFieldNameToString(accountFieldName);

        bytes memory dataKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.Data));
        data = storageContract.getString(keccak256(dataKey));
        
        bytes memory objectTypeKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.ObjectType));
        objectType = storageContract.getString(keccak256(objectTypeKey));
        
        bytes memory keysKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.Keys));
        keys = storageContract.getString(keccak256(keysKey));
        
        bytes memory isVerifiedKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.IsVerified));
        isVerified = storageContract.getBool(keccak256(isVerifiedKey));
        
        bytes memory verifiedByKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.VerifiedBy));
        verifiedBy = storageContract.getAddress(keccak256(verifiedByKey));
        
        bytes memory verifiedAtKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.VerifiedAt));
        verifiedAt = storageContract.getUint(keccak256(verifiedAtKey));
    }

    function setVerificationResult(
        address accountAddress, AccountFieldName accountFieldName,
        bool isVerified, address verifiedBy, uint verifiedAt) public {
        
        string memory fieldName = convertAccountFieldNameToString(accountFieldName);

        bytes memory isVerifiedKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.IsVerified));
        storageContract.setBool(keccak256(isVerifiedKey), isVerified);
        
        bytes memory verifiedByKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.VerifiedBy));
        storageContract.setAddress(keccak256(verifiedByKey), verifiedBy);
        
        bytes memory verifiedAtKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.VerifiedAt));
        storageContract.setUint(keccak256(verifiedAtKey), verifiedAt);
    }
    
    
    /// private methods ///

    function updateMetaInfo(address accountAddress, string data, AccountFieldName accountFieldName) private {
        string memory fieldName = convertAccountFieldNameToString(accountFieldName);

        bytes memory dataKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.Data));
        string memory storedData = storageContract.getString(keccak256(dataKey));
        if (!isEqualStrings(storedData, data)) {

            storageContract.setString(keccak256(dataKey), data);
            
            bytes memory objectTypeKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.ObjectType));
            storageContract.setString(keccak256(objectTypeKey), "");

            bytes memory keysKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.Keys));
            storageContract.setString(keccak256(keysKey), "");

            
            bytes memory isVerifiedKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.IsVerified));
            storageContract.setBool(keccak256(isVerifiedKey), false);
        
            bytes memory verifiedByKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.VerifiedBy));
            storageContract.setAddress(keccak256(verifiedByKey), address(0));
        
            bytes memory verifiedAtKey = abi.encode(accountAddress, fieldName, convertMetaFieldNameToString(MetaFieldName.VerifiedAt));
            storageContract.setUint(keccak256(verifiedAtKey), 0);
        }
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
