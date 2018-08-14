pragma solidity ^0.4.23;


import "./WithKimlicContext.sol";
import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorage.sol";
import "./BaseVerification.sol";

/// @title User profiles storage and management
/// @author Bohdan Grytsenko
/// @notice This is layer over BaseStorage which serves as single management point for everything related to user profile: data attributes hashes, access to verification details for each attribute
/// user rewarding facts, definition of user profile attributes - what are valid attribute codes to be used by all parties on Kimlic platform
contract AccountStorageAdapter is Ownable, WithKimlicContext {

    /// public attributes ///

    /// private attributes ///
    string private constant metaDataKey = "data";
    string private constant metaVerificationContractKey = "verificationContractAddress";
    string private constant lengthKey = "length";
    string private constant allowedFieldNamesKey = "allowedFieldNames";

    /// constructors ///

    constructor (address contextstorage) public WithKimlicContext(contextstorage) {
    }
    
    /// @notice used to define set of attributes valid to be part of user profile
    /// @dev used to define set of attributes valid to be part of user profile. Available only for Kimlic superuser or this contract owner
    /// @param fieldName string code for new data attribute 
    function addAllowedFieldName(string fieldName) public {
        require(msg.sender == owner || msg.sender == getContext().owner());
        
        bytes memory dataKey = abi.encode(allowedFieldNamesKey, fieldName);
        getContext().getAccountStorage().setBool(keccak256(dataKey), true);
    }
    
    /// @notice used to reduce set of attributes valid to be part of user profile
    /// @dev used to reduce set of attributes valid to be part of user profile. Available only for Kimlic superuser or this contract owner
    /// @param fieldName string code of data attribute to be removed
    function removeAllowedFieldName(string fieldName) public    {
        require(msg.sender == owner || msg.sender == getContext().owner());

        bytes memory dataKey = abi.encode(allowedFieldNamesKey, fieldName);
        getContext().getAccountStorage().deleteBool(keccak256(dataKey));
    }

    /// @notice used to check if specific attribute code is part of defined user profile
    /// @dev used to check if specific attribute code is part of defined user profile.
    /// @param fieldName string code of data attribute to be removed
    /// @return true if attribute is part of user profile, false if it's not
    function isAllowedFieldName(string fieldName) public view returns(bool) {
        bytes memory dataKey = abi.encode(allowedFieldNamesKey, fieldName);
        return getContext().getAccountStorage().getBool(keccak256(dataKey));
    }

    /// @notice used to set value of specific attribute
    /// @dev used to set value of specific attribute
    /// @param data attribute value
    /// @param accountFieldName attribute code
    function setFieldMainData(string data, string accountFieldName) public {
        require(!isEqualStrings(data, ""));
        uint index = getFieldHistoryLength(msg.sender, accountFieldName);

        if (isEqualStrings(accountFieldName, "device")) {
            require(index == 0);
        }
        string memory storedData = "";
        AccountStorage accountStorage = getContext().getAccountStorage();

        if (index > 0) {
            bytes memory dataKey = abi.encode(msg.sender, accountFieldName, index, metaDataKey);
            storedData = accountStorage.getString(keccak256(dataKey));
        }

        if (!isEqualStrings(storedData, data)) {
            addNewFieldItem(msg.sender, data, accountFieldName);
        }
    }

    function setFieldVerificationContractAddress(
        address accountAddress, string accountFieldName, uint index, address verificationContractAddress) 
        public
        checkIsColmnNameAllowed(accountFieldName) {

        KimlicContractsContext context = getContext();
        require(
            context.getVerificationContractFactory().createdContracts(msg.sender) ||
            msg.sender == address(context.getVerificationContractFactory()),
            "Access to this method allowed for verification contract, verification contract factory only");

        AccountStorage accountStorage = context.getAccountStorage();
        bytes memory verificationContractKey = abi.encode(accountAddress, accountFieldName, index, metaVerificationContractKey);
        accountStorage.setAddress(keccak256(verificationContractKey), verificationContractAddress);
    }

    /**
     @notice used by user profile sync functionality - returns details for specific attribute of particular user
     @dev used by user profile sync functionality - returns details for specific attribute of particular user. Available only for user himself, owner of this contract or Kimlic superuser 
     @param accountAddress user account address
     @param accountFieldName attribute code
     @return {
        "data": "attribute hash",
        "verificationStatusName": "attribute verification status",
        "verificationContractAddress": "verification contract address",
        "verifiedAt": "verification timestamp, unix epoch format"
        }    
    */
    function getFieldDetails(address accountAddress, string accountFieldName) 
        public
        view
        checkIsColmnNameAllowed(accountFieldName)
        checkReadingDataRestrictions(accountAddress)
        returns(string data, string verificationStatusName, address verificationContractAddress, uint256 verifiedAt) {

        AccountStorage accountStorage = getContext().getAccountStorage();
        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        
        bytes memory dataKey = abi.encode(accountAddress, accountFieldName, index, metaDataKey);
        data = accountStorage.getString(keccak256(dataKey));

        bytes memory verificationContractKey = abi.encode(accountAddress, accountFieldName, index, metaVerificationContractKey);
        verificationContractAddress = accountStorage.getAddress(keccak256(verificationContractKey));
        if (verificationContractAddress != address(0)) {
            BaseVerification verificationContract = BaseVerification(verificationContractAddress);
            
            verificationStatusName = verificationContract.getStatusName();
            verifiedAt = verificationContract.verifiedAt();
        }
    }

    /// @notice used to check if there is already verification contract for specific attribute of user account
    /// @dev used to check if there is already verification contract for specific attribute of user account
    /// @param accountAddress user account address
    /// @param accountFieldName attribute code
    /// @return address of verification contract if any or 0x0
    function getLastFieldVerificationContractAddress(address accountAddress, string accountFieldName)
        public view returns(address verificationContract) {
        
        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        return getFieldVerificationContractAddress(accountAddress, accountFieldName, index);
    }

    function getFieldVerificationContractAddress(address accountAddress, string accountFieldName, uint index)
        public
        view
        checkIsColmnNameAllowed(accountFieldName)
        checkReadingDataRestrictions(accountAddress)
        returns(address verificationContract) {
        
        bytes memory verificationContractKey = abi.encode(accountAddress, accountFieldName, index, metaVerificationContractKey);
        verificationContract = getContext().getAccountStorage().getAddress(keccak256(verificationContractKey));
    }

    /// @notice used to receive specific attribute value of user account
    /// @dev used to receive specific attribute value of user account
    /// @param accountAddress user account address
    /// @param accountFieldName attribute code
    /// @return attribute value if it it exists or 0x0
    function getFieldLastMainData(address accountAddress, string accountFieldName)
        public view returns(string data) {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        return getFieldMainData(accountAddress, accountFieldName, index);
    }

    function getFieldMainData(address accountAddress, string accountFieldName, uint index)
        public
        view
        checkIsColmnNameAllowed(accountFieldName)
        checkReadingDataRestrictions(accountAddress)
        returns(string data) {

        AccountStorage accountStorage = getContext().getAccountStorage();

        bytes memory dataKey = abi.encode(accountAddress, accountFieldName, index, metaDataKey);
        data = accountStorage.getString(keccak256(dataKey));
    }

    /// @notice used to receive verification details for specific attribute of user account
    /// @dev used to receive verification details for specific attribute of user account
    /// @param accountAddress user account address
    /// @param accountFieldName attribute code
    /// @return if verification exists returns it's status { None, Created, Verified, Unverified, Canceled }, verification contract address and timestamp when verification has been completed
    function getFieldLastVerificationData(address accountAddress, string accountFieldName)
        public view returns(BaseVerification.Status verificationStatus, address verificationContractAddress, uint256 verifiedAt) {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        return getFieldVerificationData(accountAddress, accountFieldName, index);
    }

    function getFieldVerificationData(address accountAddress, string accountFieldName, uint index)
        public
        view
        //checkIsColmnNameAllowed(accountFieldName)
        //checkReadingDataRestrictions(accountAddress)// removed cause of same getFieldVerificationContractAddress restrictions
        returns(BaseVerification.Status verificationStatus, address verificationContractAddress, uint256 verifiedAt) {

        verificationContractAddress = getFieldVerificationContractAddress(accountAddress, accountFieldName, index);
        BaseVerification verificationContract = BaseVerification(verificationContractAddress);
        
        verificationStatus = verificationContract.getStatus();
        verifiedAt = verificationContract.verifiedAt();
    }

    function getIsFieldVerificationContractExist(address accountAddress, string accountFieldName, uint index)
        //checkIsColmnNameAllowed(accountFieldName)
        //checkReadingDataRestrictions(accountAddress)// removed cause of same getFieldVerificationContractAddress restrictions
        external
        view
        returns(bool result) {
        
        address verificationContractAddress = getFieldVerificationContractAddress(accountAddress, accountFieldName, index);
        return verificationContractAddress != address(0);
    }

    /// @notice used to receive historical version number for specific attribute of user account
    /// @dev used to receive historical version number for specific attribute of user account
    /// @param accountAddress user account address
    /// @param accountFieldName attribute code
    /// @return returns 0 if attribute has never been set, if it was - history version number
    function getFieldHistoryLength(address accountAddress, string accountFieldName)
        public
        view
        checkIsColmnNameAllowed(accountFieldName)
        returns(uint length){
        
        bytes memory fieldHistoryLengthKey = abi.encode(accountAddress, accountFieldName, lengthKey);
        length = getContext().getAccountStorage().getUint(keccak256(fieldHistoryLengthKey));
    }

    /// @notice marks specific milestone as achieved for user account
    /// @dev marks specific milestone as achieved for user account. Available for usage by RewardingContract only
    /// @param accountAddress user account address
    /// @param milestone milestone number
    /// @return returns 0 if attribute has never been set, if it was - history version number
    function setRewardedAt(address accountAddress, uint milestone) public {
        KimlicContractsContext context = getContext();
        require(msg.sender == address(context.getRewardingContract()));

        AccountStorage accountStorage = context.getAccountStorage();
        bytes memory verificationContractKey = abi.encode(accountAddress, milestone, metaVerificationContractKey);
        accountStorage.setUint(keccak256(verificationContractKey), block.timestamp);
    }

    /// @notice checks if user account has been already rewarded for specific milestone
    /// @dev checks if user account has been already rewarded for specific milestone
    /// @param accountAddress user account address
    /// @param milestone milestone number
    /// @return returns 0x0 if user was not rewarded, 0x1 if reward has been already granted
    function getRewardedAt(address accountAddress, uint milestone) public view returns(uint) {
        bytes memory verificationContractKey = abi.encode(accountAddress, milestone, metaVerificationContractKey);
        return getContext().getAccountStorage().getUint(keccak256(verificationContractKey));
    }

    /// private methods ///
    function addNewFieldItem(address accountAddress, string data, string accountFieldName) private {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName) + 1;
        
        AccountStorage accountStorage = getContext().getAccountStorage();

        bytes memory dataKey = abi.encode(accountAddress, accountFieldName, index, metaDataKey);
        accountStorage.setString(keccak256(dataKey), data);
        
        bytes memory fieldHistoryLengthKey = abi.encode(accountAddress, accountFieldName, lengthKey);
        accountStorage.setUint(keccak256(fieldHistoryLengthKey), index);
    }

    function isEqualStrings(string leftValue, string rightValue) private pure returns(bool isEqual){
        isEqual = keccak256(bytes(leftValue)) == keccak256(bytes(rightValue));
    }

    modifier checkReadingDataRestrictions(address account) {
        KimlicContractsContext context = getContext();
        require(
            context.getVerificationContractFactory().createdContracts(msg.sender) ||
            context.getProvisioningContractFactory().createdContracts(msg.sender) ||
            msg.sender == address(context.getVerificationContractFactory()) ||
            msg.sender == address(context.getRewardingContract()) ||
            msg.sender == owner ||
            msg.sender == context.owner() ||
            msg.sender == account,
            "Access to this method not allowed from current account");
        _;
    }

    modifier checkIsColmnNameAllowed(string name) {
        require(isAllowedFieldName(name), "Provided field name is not allowed");
        _;
    }
}
