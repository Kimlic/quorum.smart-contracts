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

    function addAccessToFieldVerification(address party, string columnName) public {
        require(getContext().getAccountStorageAdapter().isAllowedColumnName(columnName));

        AttestationPartyStorage storageAdapter = AttestationPartyStorage(getStorage());
        storageAdapter.setBool(getAllowanceKey(party, columnName), true);
    }

    function getIsFieldVerificationAllowed(address party, string columnName) public view returns(bool) {
        require(getContext().getAccountStorageAdapter().isAllowedColumnName(columnName));

        AttestationPartyStorage storageAdapter = AttestationPartyStorage(getStorage());
        return storageAdapter.getBool(getAllowanceKey(party, columnName));
    }

    function removeAccessToFieldVerification(address party, string columnName) public {
        AttestationPartyStorage storageAdapter = AttestationPartyStorage(getStorage());
        storageAdapter.deleteBool(getAllowanceKey(party, columnName));
    }

    /// internal methods ///
    function getAllowanceKey(address party, string columnName) internal pure returns(bytes32) {
        return keccak256(abi.encode(party, accessKeyPart, columnName));
    }

    function getStorage() view internal returns (BaseStorage) {
        return getContext().getAttestationPartyStorage();
    }
    
    /// Modifiers ///
}