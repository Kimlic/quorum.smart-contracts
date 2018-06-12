pragma solidity ^0.4.23;


import "./WithKimlicContext.sol";
import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorage.sol";

contract AccountStorageAdapter is Ownable, WithKimlicContext {

    /// public attributes ///

    /// private attributes ///
    string constant lengthCaption = "length";

    /// Enums ///

    enum AccountFieldName { Email, Phone, Identity, Device, Documents, Addresses }

    enum MetaFieldName { Data, ObjectType, IsVerified, VerifiedBy, VerifiedAt } //TODO do we still need IsVerified?

    /// constructors ///

    constructor (address contextstorage) public WithKimlicContext(contextstorage) {
    }

    /// public methods ///

    function setAccountData(string identityHash, string phoneHash, string emailHash, bytes32 deviceHash) public {

        updateAccountField(msg.sender, emailHash, AccountFieldName.Email);
        updateAccountField(msg.sender, phoneHash, AccountFieldName.Phone);
        updateAccountField(msg.sender, identityHash, AccountFieldName.Identity);
        
        AccountStorage accountStorage = getContext().getAccountStorage();

        bytes memory deviceHashKey = abi.encode(msg.sender, convertAccountFieldNameToString(AccountFieldName.Device));
        bytes32 storedDeviceHash = accountStorage.getBytes32(keccak256(deviceHashKey));
        if(storedDeviceHash != deviceHash) {
            accountStorage.setBytes32(keccak256(deviceHashKey), deviceHash);
        }
    }

    function addAddress(string data, string objectType) public {
        addNewFieldItem(msg.sender, AccountFieldName.Addresses, data, objectType);
    }

    function addDocument(string data, string objectType) public {
        addNewFieldItem(msg.sender, AccountFieldName.Documents, data, objectType);
    }

    function getLastAccountDataVerifiedBy(address accountAddress, AccountFieldName accountFieldName) public view returns(address verifiedBy) {
        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        return getAccountDataVerifiedBy(accountAddress, accountFieldName, index);
    }

    function getAccountDataVerifiedBy(address accountAddress, AccountFieldName accountFieldName, uint index)
            public view checkReadingDataRestrictions(accountAddress) returns(address verifiedBy) {
        string memory fieldName = convertAccountFieldNameToString(accountFieldName);
        bytes memory verifiedByKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.VerifiedBy));
        verifiedBy = getContext().getAccountStorage().getAddress(keccak256(verifiedByKey));
    }

    function getLastAccountData(address accountAddress, AccountFieldName accountFieldName)
        public view returns(string data, string objectType, bool isVerified, address verifiedBy, uint256 verifiedAt) {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        return getAccountData(accountAddress, accountFieldName, index);
    }

    function getAccountData(address accountAddress, AccountFieldName accountFieldName, uint index)
        public
        view
        checkReadingDataRestrictions(accountAddress)
        returns(string data, string objectType, bool isVerified, address verifiedBy, uint256 verifiedAt) {

        //AccountStorage accountStorage = getContext().getAccountStorage();// TODO find reason of error "Stack too deep, try removing local variables"

        string memory fieldName = convertAccountFieldNameToString(accountFieldName);

        bytes memory dataKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.Data));
        data = getContext().getAccountStorage().getString(keccak256(dataKey));

        bytes memory objectTypeKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.ObjectType));
        objectType = getContext().getAccountStorage().getString(keccak256(objectTypeKey));

        bytes memory isVerifiedKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.IsVerified));
        isVerified = getContext().getAccountStorage().getBool(keccak256(isVerifiedKey));

        bytes memory verifiedByKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.VerifiedBy));
        verifiedBy = getContext().getAccountStorage().getAddress(keccak256(verifiedByKey));

        bytes memory verifiedAtKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.VerifiedAt));
        verifiedAt = getContext().getAccountStorage().getUint(keccak256(verifiedAtKey));
    }

    function setVerificationResult(
        address accountAddress, AccountFieldName accountFieldName,
        bool isVerified, address verifiedBy, uint verifiedAt) public {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        setVerificationResult(accountAddress, accountFieldName, index, isVerified, verifiedBy, verifiedAt);
    }

    function setVerificationResult(
        address accountAddress, AccountFieldName accountFieldName, uint index,
        bool isVerified, address verifiedBy, uint verifiedAt) public verificationContractOrOwnerOnly() {

        KimlicContractsContext context = getContext();

        string memory fieldName = convertAccountFieldNameToString(accountFieldName);
        
        AccountStorage accountStorage = context.getAccountStorage();

        bytes memory isVerifiedKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.IsVerified));
        accountStorage.setBool(keccak256(isVerifiedKey), isVerified);

        bytes memory verifiedByKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.VerifiedBy));
        accountStorage.setAddress(keccak256(verifiedByKey), verifiedBy);

        bytes memory verifiedAtKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.VerifiedAt));
        accountStorage.setUint(keccak256(verifiedAtKey), verifiedAt);

        context.getRewardingContract().checkMilestones(accountAddress, accountFieldName);
    }

    function getFieldHistoryLength(address accountAddress, AccountFieldName accountFieldName) public view returns(uint length){
        bytes memory fieldHistoryLengthKey = abi.encode(accountAddress, accountFieldName, lengthCaption);
        length = getContext().getAccountStorage().getUint(keccak256(fieldHistoryLengthKey));
    }

    /// private methods ///

    function updateAccountField(address accountAddress, string data, AccountFieldName accountFieldName) private {
        string memory fieldName = convertAccountFieldNameToString(accountFieldName);

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);

        bytes memory dataKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.Data));
        string memory storedData = getContext().getAccountStorage().getString(keccak256(dataKey));
        if (!isEqualStrings(storedData, data)) {
            addNewFieldItem(accountAddress, accountFieldName, data, "");
        }
    }


    function addNewFieldItem(
        address accountAddress, AccountFieldName accountFieldName,
        string data, string objectType) private {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName) + 1;

        string memory fieldName = convertAccountFieldNameToString(accountFieldName);
        
        AccountStorage accountStorage = getContext().getAccountStorage();

        bytes memory newDataKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.Data));
        accountStorage.setString(keccak256(newDataKey), data);

        bytes memory objectTypeKey = abi.encode(accountAddress, fieldName, index, convertMetaFieldNameToString(MetaFieldName.ObjectType));
        accountStorage.setString(keccak256(objectTypeKey), objectType);

        bytes memory fieldHistoryLengthKey = abi.encode(accountAddress, accountFieldName, lengthCaption);
        accountStorage.setUint(keccak256(fieldHistoryLengthKey), index);
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

    modifier verificationContractOrOwnerOnly() {
        KimlicContractsContext context = getContext();
        require(
            context.getVerificationContractFactory().createdContracts(msg.sender) ||
            msg.sender == context.owner());
        _;
    }

    modifier checkReadingDataRestrictions(address account) {
        KimlicContractsContext context = getContext();
        require(
            context.getVerificationContractFactory().createdContracts(msg.sender) ||
            context.getProvisioningContractFactory().createdContracts(msg.sender) ||
            msg.sender == context.owner() ||
            msg.sender == account);
        _;
    }
}
