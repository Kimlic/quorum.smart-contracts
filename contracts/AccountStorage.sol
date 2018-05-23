pragma solidity 0.4.24;


contract AccountStorage {
    mapping(bytes32 => Account) public accounts;

    struct Meta {
        bytes32 data;
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
        /*Meta[] documents;
        Meta[] addresses;*///TODO: Return to this part on 2nd sprint
        bytes32 device;
    }

    function setAccountData(
        bytes32 accountId, bytes32 identityHash,
        bytes32 phoneHash, bytes32 emailHash,
        bytes32 deviceHash) public {

        Account storage account = accounts[accountId];
        if (account.identity.data != identityHash) {
            account.identity = createNewMeta(identityHash);
        }
        if (account.phone.data != phoneHash) {
            account.phone = createNewMeta(phoneHash);
        }
        if (account.email.data != emailHash) {
            account.email = createNewMeta(emailHash);
        }
        if (account.device != deviceHash) {
            account.device = deviceHash;
        }

    }

    function getAccountData(bytes32 accountId, string dataFieldName)
    public view returns(bytes32 data, string objectType, string keys,
        bool isVerified, address verifiedBy, uint256 verifiedAt) {

        Account storage account = accounts[accountId];
        Meta memory meta;
        if (isEqualStrings(dataFieldName, "identity")) {
            meta = account.identity;
        }
        if (isEqualStrings(dataFieldName, "phone")) {
            meta = account.phone;
        }
        if (isEqualStrings(dataFieldName, "email")) {
            meta = account.email;
        }
        data = meta.data;
        objectType = meta.objectType;
        keys = meta.keys;
        isVerified = meta.isVerified;
        verifiedBy = meta.verifiedBy;
        objectType = meta.objectType;
        verifiedAt = meta.verifiedAt;
    }

    function createNewMeta(bytes32 data) private pure returns(Meta meta) {
        meta.data = data;
    }

    function isEqualStrings(string leftString, string rightString) private pure returns(bool isEqual) {
        isEqual = keccak256(bytes(leftString)) == keccak256(bytes(rightString));
    }
}
