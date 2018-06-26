pragma solidity ^0.4.23;


import "./WithKimlicContext.sol";
import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./AccountStorage.sol";

contract AccountStorageAdapter is Ownable, WithKimlicContext {

    /// public attributes ///

    /// private attributes ///
    string private constant metaDataKey = "metaData";
    string private constant metaIsVerifiedKey = "metaIsVerified";
    string private constant metaVerifiedAtKey = "metaVerifiedAt";
    string private constant metaVerifiedByKey = "metaVerifiedBy";
    string private constant lengthKey = "length";

    /// constructors ///

    constructor (address contextstorage) public WithKimlicContext(contextstorage) {
    }

    /// public methods ///

    function setAccountFieldMainData(string data, string accountFieldName) public {
        updateAccountField(msg.sender, data, accountFieldName);
    }

    function getLastAccountDataVerifiedBy(address accountAddress, string accountFieldName) public view returns(address verifiedBy) {
        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        return getAccountDataVerifiedBy(accountAddress, accountFieldName, index);
    }

    function getAccountDataVerifiedBy(address accountAddress, string accountFieldName, uint index)
            public view checkReadingDataRestrictions(accountAddress) returns(address verifiedBy) {
        bytes memory verifiedByKey = abi.encode(accountAddress, accountFieldName, index, metaVerifiedByKey);
        verifiedBy = getContext().getAccountStorage().getAddress(keccak256(verifiedByKey));
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
        public view returns(bool isVerified, address verifiedBy, uint256 verifiedAt) {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        return getAccountFieldVerificationData(accountAddress, accountFieldName, index);
    }

    function getAccountFieldVerificationData(address accountAddress, string accountFieldName, uint index)
        public
        view
        checkReadingDataRestrictions(accountAddress)
        returns(bool isVerified, address verifiedBy, uint256 verifiedAt) {


        AccountStorage accountStorage = getContext().getAccountStorage();

        bytes memory isVerifiedKey = abi.encode(accountAddress, accountFieldName, index, metaIsVerifiedKey);
        isVerified = accountStorage.getBool(keccak256(isVerifiedKey));

        bytes memory verifiedByKey = abi.encode(accountAddress, accountFieldName, index, metaVerifiedByKey);
        verifiedBy = accountStorage.getAddress(keccak256(verifiedByKey));

        bytes memory verifiedAtKey = abi.encode(accountAddress, accountFieldName, index, metaVerifiedAtKey);
        verifiedAt = accountStorage.getUint(keccak256(verifiedAtKey));
    }

    function setAccountFieldVerificationData(
        address accountAddress, string accountFieldName,
        bool isVerified, address verifiedBy, uint verifiedAt) public {

        uint index = getFieldHistoryLength(accountAddress, accountFieldName);
        setAccountFieldVerificationData(accountAddress, accountFieldName, index, isVerified, verifiedBy, verifiedAt);
    }

    function setAccountFieldVerificationData(
        address accountAddress, string accountFieldName, uint index,
        bool isVerified, address verifiedBy, uint verifiedAt) public verificationContractOrOwnerOnly() {

        KimlicContractsContext context = getContext();
        
        AccountStorage accountStorage = context.getAccountStorage();

        bytes memory isVerifiedKey = abi.encode(accountAddress, accountFieldName, index, metaIsVerifiedKey);
        accountStorage.setBool(keccak256(isVerifiedKey), isVerified);

        bytes memory verifiedByKey = abi.encode(accountAddress, accountFieldName, index, metaVerifiedByKey);
        accountStorage.setAddress(keccak256(verifiedByKey), verifiedBy);

        bytes memory verifiedAtKey = abi.encode(accountAddress, accountFieldName, index, metaVerifiedAtKey);
        accountStorage.setUint(keccak256(verifiedAtKey), verifiedAt);

        context.getRewardingContract().checkMilestones(accountAddress, accountFieldName);
    }

    function getFieldHistoryLength(address accountAddress, string accountFieldName) public view returns(uint length){
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
            msg.sender == context.owner());
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
            msg.sender == account);
        _;
    }
}
