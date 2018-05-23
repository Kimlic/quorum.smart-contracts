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

    enum AccountFieldName {Email, Phone, Identity }

    function setAccountData(
        bytes32 accountId, bytes32 identityHash,
        bytes32 phoneHash, bytes32 emailHash, bytes32 deviceHash) public {

        Account storage account = accounts[accountId];

        account.identity = account.identity.data != identityHash ? createNewMeta(identityHash) : account.identity;
        account.phone = account.phone.data != phoneHash ? createNewMeta(phoneHash) : account.phone;
        account.email = account.email.data != emailHash ? createNewMeta(identityHash) : account.email;
        account.device = account.device != deviceHash ? deviceHash : account.device;
    }

    function getAccountData(bytes32 accountId, AccountFieldName accountFieldName)
        public view returns(bytes32 data, string objectType, string keys,
            bool isVerified, address verifiedBy, uint256 verifiedAt) {

        Meta storage meta = getFieldValueByEnum(accountId, accountFieldName);
        data = meta.data;
        objectType = meta.objectType;
        keys = meta.keys;
        objectType = meta.objectType;
        isVerified = meta.isVerified;
        verifiedBy = meta.verifiedBy;
        verifiedAt = meta.verifiedAt;
    }

    function setVerificationResult(
        bytes32 accountId, AccountFieldName accountFieldName,
        bool isVerified, address verifiedBy,uint verifiedAt) public {
        
        Meta storage meta = getFieldValueByEnum(accountId, accountFieldName);
        
        meta.isVerified = isVerified;
        meta.verifiedBy = verifiedBy;
        meta.verifiedAt = verifiedAt;
    }

    function getFieldValueByEnum(bytes32 accountId, AccountFieldName accountFieldName) private view returns(Meta storage meta) {
        Account storage account = accounts[accountId];
        if (accountFieldName == AccountFieldName.Email) {
            meta = account.identity;
        }
        else if (accountFieldName == AccountFieldName.Phone) {
            meta = account.phone;
        }
        else if (accountFieldName == AccountFieldName.Identity) {
            meta = account.email;
        }
    }

    function createNewMeta(bytes32 data) private pure returns(Meta meta) {
        meta.data = data;
    }
}
