pragma solidity ^0.4.23;


import "./WithKimlicContext.sol";
import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorage.sol";

contract AccountStorageAdapter is Ownable, WithKimlicContext {

    /// public attributes ///
    mapping(string=>bool) allowedColumnNames;

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

    function addAllowedColumnName(string columnName) public onlyOwner() {
        allowedColumnNames[columnName] = true;
    }

    function removeAllowedColumnName(string columnName) public onlyOwner() {
        delete allowedColumnNames[columnName];
    }

    function isAllowedColumnName(string columnName) public view onlyOwner() returns(bool) {
        return allowedColumnNames[columnName];
    }

    function setAccountFieldMainData(string data, string accountFieldName) public {
        updateAccountField(msg.sender, data, accountFieldName);
    }

    function getLastAccountDataVerificationContractAddress(address accountAddress, string accountFieldName)
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
        public view returns(bool verificationStatus, address verificationContract, uint256 verifiedAt) {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        return getAccountFieldVerificationData(accountAddress, accountFieldName, index);
    }

    function getAccountFieldVerificationData(address accountAddress, string accountFieldName, uint index)
        public
        view
        checkIsColmnNameAllowed(accountFieldName)
        checkReadingDataRestrictions(accountAddress)
        returns(bool verificationStatus, address verificationContract, uint256 verifiedAt) {


        AccountStorage accountStorage = getContext().getAccountStorage();

        bytes memory verificationStatusKey = abi.encode(accountAddress, accountFieldName, index, metaVerificationStatusKey);
        verificationStatus = accountStorage.getBool(keccak256(verificationStatusKey));

        bytes memory verificationContractKey = abi.encode(accountAddress, accountFieldName, index, metaVerificationContractKey);
        verificationContract = accountStorage.getAddress(keccak256(verificationContractKey));

        bytes memory verifiedAtKey = abi.encode(accountAddress, accountFieldName, index, metaVerifiedAtKey);
        verifiedAt = accountStorage.getUint(keccak256(verifiedAtKey));
    }

    function setAccountFieldVerificationData(
        address accountAddress, string accountFieldName,
        bool verificationStatus, address verificationContract, uint verifiedAt) public {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        setAccountFieldVerificationData(accountAddress, accountFieldName, index, verificationStatus, verificationContract, verifiedAt);
    }

    function setAccountFieldVerificationData(
        address accountAddress, string accountFieldName, uint index,
        bool verificationStatus, address verificationContract, uint verifiedAt) 
        public
        checkIsColmnNameAllowed(accountFieldName)
        verificationContractOrOwnerOnly() {

        KimlicContractsContext context = getContext();
        
        AccountStorage accountStorage = context.getAccountStorage();

        bytes memory verificationStatusKey = abi.encode(accountAddress, accountFieldName, index, metaVerificationStatusKey);
        accountStorage.setBool(keccak256(verificationStatusKey), verificationStatus);

        bytes memory verificationContractKey = abi.encode(accountAddress, accountFieldName, index, metaVerificationContractKey);
        accountStorage.setAddress(keccak256(verificationContractKey), verificationContract);

        bytes memory verifiedAtKey = abi.encode(accountAddress, accountFieldName, index, metaVerifiedAtKey);
        accountStorage.setUint(keccak256(verifiedAtKey), verifiedAt);

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
            msg.sender == context.owner(), "Access to this method allowed for verification contract or owner only");
        _;
    }

    modifier checkReadingDataRestrictions(address account) {
        KimlicContractsContext context = getContext();
        require(
            context.getVerificationContractFactory().createdContracts(msg.sender) ||
            context.getProvisioningContractFactory().createdContracts(msg.sender) ||
            msg.sender == address(context.getRewardingContract()) ||
            msg.sender == owner ||
            msg.sender == context.owner() ||
            msg.sender == account,
            "Access to this method not allowed from current account");
        _;
    }

    modifier checkIsColmnNameAllowed(string name) {
        require(allowedColumnNames[name], "Provided column name is not allowed");
        _;
    }
}
