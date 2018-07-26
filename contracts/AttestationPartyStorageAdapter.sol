pragma solidity ^0.4.23;


import "./BaseStorage.sol";
import "./WithKimlicContext.sol";
import "./KimlicContractsContext.sol";
import "./AttestationPartyStorage.sol";
import "./BasePartyStorageAdapter.sol";

contract AttestationPartyStorageAdapter is BasePartyStorageAdapter {

    /// private attributes ///
    string private constant accessKeyPart = "IsVerificaionAllowed";

    /// constructors ///
    constructor (address contextStorage) public BasePartyStorageAdapter(contextStorage) {
        
    }

    function addAccessToFieldVerification(address party, string fieldName) public {
        KimlicContractsContext context = getContext();
        require(msg.sender == context.owner());
        require(context.getAccountStorageAdapter().isAllowedFieldName(fieldName));

        AttestationPartyStorage storageAdapter = AttestationPartyStorage(getStorage());
        storageAdapter.setBool(getAllowanceKey(party, fieldName), true);
    }

    function getIsFieldVerificationAllowed(address party, string fieldName) public view returns(bool) {
        KimlicContractsContext context = getContext();
        require(context.getAccountStorageAdapter().isAllowedFieldName(fieldName));

        AttestationPartyStorage storageAdapter = AttestationPartyStorage(getStorage());
        return storageAdapter.getBool(getAllowanceKey(party, fieldName));
    }

    function removeAccessToFieldVerification(address party, string fieldName) public {
        KimlicContractsContext context = getContext();
        require(msg.sender == context.owner());
        require(context.getAccountStorageAdapter().isAllowedFieldName(fieldName));

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