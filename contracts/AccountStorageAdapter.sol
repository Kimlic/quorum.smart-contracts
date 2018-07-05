pragma solidity ^0.4.23;


import "./WithKimlicContext.sol";
import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorage.sol";
import "./BaseVerification.sol";


contract AccountStorageAdapter is Ownable, WithKimlicContext {

    /// public attributes ///
    mapping(string=>bool) allowedFieldNames;

    /// private attributes ///
    string private constant metaDataKey = "metaData";
    string private constant metaVerificationStatusKey = "metaVerificationStatus";
    string private constant metaVerifiedAtKey = "metaVerifiedAt";
    string private constant metaVerificationContractKey = "metaVerificationContract";
    string private constant lengthKey = "length";

    /// constructors ///

    constructor (address contextstorage) public WithKimlicContext(contextstorage) {
    }

    /// public methods ///

    function addAllowedFieldName(string fieldName) public onlyOwner() {
        allowedFieldNames[fieldName] = true;
    }

    function removeAllowedFieldName(string fieldName) public onlyOwner() {
        delete allowedFieldNames[fieldName];
    }

    function isAllowedFieldName(string fieldName) public view returns(bool) {
        return allowedFieldNames[fieldName];
    }

    function setAccountFieldMainData(string data, string accountFieldName) public {
        updateAccountField(msg.sender, data, accountFieldName);
    }

    function getAccountFieldLastVerificationContractAddress(address accountAddress, string accountFieldName)
        public view returns(address verificationContract) {
        
        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        return getAccountDataVerificationContractAddress(accountAddress, accountFieldName, index);
    }

    function getAccountDataVerificationContractAddress(address accountAddress, string accountFieldName, uint index)
        public
        view
        checkIsColmnNameAllowed(accountFieldName)
        checkReadingDataRestrictions(accountAddress)
        returns(address verificationContract) {
        
        bytes memory verificationContractKey = abi.encode(accountAddress, accountFieldName, index, metaVerificationContractKey);
        verificationContract = getContext().getAccountStorage().getAddress(keccak256(verificationContractKey));
    }

    function getAccountFieldLastMainData(address accountAddress, string accountFieldName)
        public view returns(string data) {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        return getAccountFieldMainData(accountAddress, accountFieldName, index);
    }

    function getAccountFieldMainData(address accountAddress, string accountFieldName, uint index)
        public
        view
        checkReadingDataRestrictions(accountAddress)
        returns(string data) {

        AccountStorage accountStorage = getContext().getAccountStorage();

        bytes memory dataKey = abi.encode(accountAddress, accountFieldName, index, metaDataKey);
        data = accountStorage.getString(keccak256(dataKey));
    }

    function getAccountFieldLastVerificationData(address accountAddress, string accountFieldName)
        public view returns(BaseVerification.Status verificationStatus, address verificationContractAddress, uint256 verifiedAt) {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        return getAccountFieldVerificationData(accountAddress, accountFieldName, index);
    }

    function getAccountFieldVerificationData(address accountAddress, string accountFieldName, uint index)
        public
        view
        //checkIsColmnNameAllowed(accountFieldName)
        //checkReadingDataRestrictions(accountAddress)// removed cause of same getAccountDataVerificationContractAddress restrictions
        returns(BaseVerification.Status verificationStatus, address verificationContractAddress, uint256 verifiedAt) {

        verificationContractAddress = getAccountDataVerificationContractAddress(accountAddress, accountFieldName, index);
        BaseVerification verificationContract = BaseVerification(verificationContractAddress);
        
        verificationStatus = verificationContract.status();
        verifiedAt = verificationContract.verifiedAt();
    }

    function getIsFieldLastVerificationContractExistAndNotCanceled(address accountAddress, string accountFieldName) 
        public view returns(bool result) {
        
        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        return getIsFieldVerificationContractExistAndNotCanceled(accountAddress, accountFieldName, index);
    }

    function getIsFieldVerificationContractExistAndNotCanceled(address accountAddress, string accountFieldName, uint index)
        //checkIsColmnNameAllowed(accountFieldName)
        //checkReadingDataRestrictions(accountAddress)// removed cause of same getAccountDataVerificationContractAddress restrictions
        public view returns(bool result) {
        
        address verificationContractAddress = getAccountDataVerificationContractAddress(accountAddress, accountFieldName, index);
        if (verificationContractAddress != address(0)) {
            BaseVerification verificationContract = BaseVerification(verificationContractAddress);
            BaseVerification.Status verificationStatus = verificationContract.status();
            result = verificationStatus != BaseVerification.Status.Canceled;
        }
    }

    function setAccountFieldVerificationContractAddress(
        address accountAddress, string accountFieldName, address verificationContractAddress) public {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        setAccountFieldVerificationContractAddress(accountAddress, accountFieldName, index, verificationContractAddress);
    }

    function setAccountFieldVerificationContractAddress(
        address accountAddress, string accountFieldName, uint index, address verificationContractAddress) 
        public
        checkIsColmnNameAllowed(accountFieldName)
        verificationContractOrOwnerOnly() {

        KimlicContractsContext context = getContext();
        
        AccountStorage accountStorage = context.getAccountStorage();

        bytes memory verificationContractKey = abi.encode(accountAddress, accountFieldName, index, metaVerificationContractKey);
        accountStorage.setAddress(keccak256(verificationContractKey), verificationContractAddress);

        context.getRewardingContract().checkMilestones(accountAddress, accountFieldName);
    }

    function getFieldHistoryLength(address accountAddress, string accountFieldName)
        public
        view
        checkIsColmnNameAllowed(accountFieldName)
        returns(uint length){
        
        bytes memory fieldHistoryLengthKey = abi.encode(accountAddress, accountFieldName, lengthKey);
        length = getContext().getAccountStorage().getUint(keccak256(fieldHistoryLengthKey));
    }

    /// private methods ///

    function updateAccountField(address accountAddress, string data, string accountFieldName) private {
        
        require(!isEqualStrings(data, ""));
        uint index = getFieldHistoryLength(accountAddress, accountFieldName);

        if (isEqualStrings(accountFieldName, "device")) {
            require(index == 0);
        }
        string memory storedData = "";
        AccountStorage accountStorage = getContext().getAccountStorage();

        if (index > 0) {
            bytes memory dataKey = abi.encode(accountAddress, accountFieldName, index, metaDataKey);
            storedData = accountStorage.getString(keccak256(dataKey));
        }

        if (!isEqualStrings(storedData, data)) {
            addNewFieldItem(accountAddress, data, accountFieldName);
        }
    }


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

    modifier verificationContractOrOwnerOnly() {
        KimlicContractsContext context = getContext();
        require(
            context.getVerificationContractFactory().createdContracts(msg.sender) ||
            msg.sender == address(context.getVerificationContractFactory()) ||
            msg.sender == context.owner(),
            "Access to this method allowed for verification contract, verification contract factory or account storage adapter owner only");
        _;
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
        require(allowedFieldNames[name], "Provided field name is not allowed");
        _;
    }
}
