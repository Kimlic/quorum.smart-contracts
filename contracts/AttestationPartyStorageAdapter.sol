pragma solidity ^0.4.23;


import "./BaseStorage.sol";
import "./WithKimlicContext.sol";
import "./KimlicContractsContext.sol";
import "./AttestationPartyStorage.sol";
import "./BasePartyStorageAdapter.sol";

/// @title Attestation party verification rights management
/// @author Bohdan Grytsenko
/// @notice This is layer over BaseStorage which serves as management point for set of attributes Attestation party is allowed to verify
contract AttestationPartyStorageAdapter is BasePartyStorageAdapter {

    /// private attributes ///
    string private constant accessKeyPart = "IsVerificaionAllowed";

    /// constructors ///
    constructor (address contextStorage) public BasePartyStorageAdapter(contextStorage) {
        
    }

    /// @notice grants right to verify specific attribute to particular AP
    /// @dev grants right to verify specific attribute to particular AP
    /// @param party AP account address
    /// @param fieldName attribute string code
    function addAccessToFieldVerification(address party, string fieldName) public {
        KimlicContractsContext context = getContext();
        require(msg.sender == context.owner());
        require(context.getAccountStorageAdapter().isAllowedFieldName(fieldName));

        AttestationPartyStorage storageAdapter = AttestationPartyStorage(getStorage());
        storageAdapter.setBool(getAllowanceKey(party, fieldName), true);
    }

    /// @notice checks if party has right to verify specific attribute
    /// @dev checks if party has right to verify specific attribute
    /// @param party AP account address
    /// @param fieldName attribute string code
    /// @return true if party has right, false if it has no right
    function getIsFieldVerificationAllowed(address party, string fieldName) public view returns(bool) {
        KimlicContractsContext context = getContext();
        require(context.getAccountStorageAdapter().isAllowedFieldName(fieldName));

        AttestationPartyStorage storageAdapter = AttestationPartyStorage(getStorage());
        return storageAdapter.getBool(getAllowanceKey(party, fieldName));
    }

    /// @notice revokes right to verify specific attribute from particular AP
    /// @dev revokes right to verify specific attribute from particular AP
    /// @param party AP account address
    /// @param fieldName attribute string code    
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