pragma solidity ^0.4.23;


import "./WithKimlicContext.sol";
import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorage.sol";
import "./BaseVerification.sol";


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

    /// public methods ///
    function addAllowedFieldName(string fieldName) public {
        require(msg.sender == owner || msg.sender == getContext().owner());
        
        bytes memory dataKey = abi.encode(allowedFieldNamesKey, fieldName);
        getContext().getAccountStorage().setBool(keccak256(dataKey), true);
    }

    function removeAllowedFieldName(string fieldName) public    {
        require(msg.sender == owner || msg.sender == getContext().owner());

        bytes memory dataKey = abi.encode(allowedFieldNamesKey, fieldName);
        getContext().getAccountStorage().deleteBool(keccak256(dataKey));
    }

    function isAllowedFieldName(string fieldName) public view returns(bool) {
        bytes memory dataKey = abi.encode(allowedFieldNamesKey, fieldName);
        return getContext().getAccountStorage().getBool(keccak256(dataKey));
    }

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

    function getFieldHistoryLength(address accountAddress, string accountFieldName)
        public
        view
        checkIsColmnNameAllowed(accountFieldName)
        returns(uint length){
        
        bytes memory fieldHistoryLengthKey = abi.encode(accountAddress, accountFieldName, lengthKey);
        length = getContext().getAccountStorage().getUint(keccak256(fieldHistoryLengthKey));
    }

    function setRewardedAt(address accountAddress, uint milestone) public {
        KimlicContractsContext context = getContext();
        require(msg.sender == address(context.getRewardingContract()));

        AccountStorage accountStorage = context.getAccountStorage();
        bytes memory verificationContractKey = abi.encode(accountAddress, milestone, metaVerificationContractKey);
        accountStorage.setUint(keccak256(verificationContractKey), block.timestamp);
    }

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
