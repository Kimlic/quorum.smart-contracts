pragma solidity ^0.4.23;


import "./BaseStorage.sol";
import "./WithKimlicContext.sol";
import "./AttestationPartyStorage.sol";
import "./BasePartyStorageAdapter.sol";

contract AttestationPartyStorageAdapter is BasePartyStorageAdapter {

    /// private attributes ///
    string private constant accessKeyPart = "IsVerificaionAllowed";
    
    /// constructors ///
    constructor (address contextStorage) public BasePartyStorageAdapter(contextStorage) {
        
    }

    function addAccessToFieldVerification(address party, string fieldName) public {//TODO access restrictions
        require(getContext().getAccountStorageAdapter().isAllowedFieldName(fieldName));

        AttestationPartyStorage storageAdapter = AttestationPartyStorage(getStorage());
        storageAdapter.setBool(getAllowanceKey(party, fieldName), true);
    }

    function getIsFieldVerificationAllowed(address party, string fieldName) public view returns(bool) {
        require(getContext().getAccountStorageAdapter().isAllowedFieldName(fieldName));

        AttestationPartyStorage storageAdapter = AttestationPartyStorage(getStorage());
        return storageAdapter.getBool(getAllowanceKey(party, fieldName));
    }

    function removeAccessToFieldVerification(address party, string fieldName) public {//TODO access restrictions
        AttestationPartyStorage storageAdapter = AttestationPartyStorage(getStorage());
        storageAdapter.deleteBool(getAllowanceKey(party, fieldName));
    }

    /// internal methods ///
    function getAllowanceKey(address party, string fieldName) internal pure returns(bytes32) {
        return keccak256(abi.encode(party, accessKeyPart, fieldName));
    }

    function getStorage() view internal returns (BaseStorage) {
        return getContext().getAttestationPartyStorage();
    }
    
    /// Modifiers ///
}