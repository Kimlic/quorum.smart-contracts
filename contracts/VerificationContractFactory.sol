pragma solidity ^0.4.23;


import "./openzeppelin-solidity/Ownable.sol";
import "./BaseVerification.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicContractsContext.sol";
import "./WithKimlicContext.sol";
import "./KimlicToken.sol";

/// @title Factory contract for data verification process
/// @author Bohdan Grytsenko
/// @notice Produces verification contract for each case of client attribute verification requested
contract VerificationContractFactory is WithKimlicContext {
    /// public attributes ///
    mapping(address=>bool) public createdContracts;

    /// private attributes ///
    mapping(string=>address) private contracts;
    mapping(string=>uint) private tokensLockPeriod;

    /// Constructors ///
    constructor(address contextStorage) public WithKimlicContext(contextStorage) {
    }

    /// @notice returns tokens lock period for specific attribute
    /// @param filedName attribute code
    /// @return tokens lock period for specific attribute in seconds    
    function getTokensLockPeriod(string filedName) view public returns (uint) {
        return tokensLockPeriod[filedName];
    }

    /// @notice defines tokens lock period for specific attribute
    /// @param filedName attribute code
    /// @param lockPeriod tokens lock period for specific attribute in seconds
    function setTokensLockPeriod(string filedName, uint lockPeriod) public returns (uint) {
        tokensLockPeriod[filedName] = lockPeriod;
    }

    /// @notice returns address of created contract
    /// @param key random string speficied at creation
    function getVerificationContract(string key) view public returns (address) {
        return contracts[key];
    }

    //obsolete method, use createBaseVerificationContract.
    function createEmailVerification(address account, address attestationPartyAddress, string key) public {
        createBaseVerificationContract(account, attestationPartyAddress, key, "email");
    }

    //obsolete method, use createBaseVerificationContract.
    function createPhoneVerification(address account, address attestationPartyAddress, string key) public {
        createBaseVerificationContract(account, attestationPartyAddress, key, "phone");
    }

    //obsolete method, use createBaseVerificationContract.
    function createDocumentVerification(address account, address attestationPartyAddress, string key) public {
        createBaseVerificationContract(account, attestationPartyAddress, key, "documents.id_card");
    }
    
    /// @notice creates verification contract for specific client and attribute
    /// @param account user account address
    /// @param attestationPartyAddress Attestation party address which going to perform verification
    /// @param key random string, used to receive created contract address
    /// @param accountFieldName attribute code
    function createBaseVerificationContract(address account, address attestationPartyAddress, string key, string accountFieldName) public {
        KimlicContractsContext context = getContext();

        AccountStorageAdapter accountStorageAdapter = context.getAccountStorageAdapter();
        uint dataIndex = accountStorageAdapter.getFieldHistoryLength(account, accountFieldName);
        require(dataIndex > 0, "Data is empty");

        bool verificationContractAlreadyExist = context.getAccountStorageAdapter()
            .getIsFieldVerificationContractExist(account, accountFieldName, dataIndex);
        require(!verificationContractAlreadyExist, "Verification contract for this data already created");

        require(
            context.getAttestationPartyStorageAdapter().getIsFieldVerificationAllowed(attestationPartyAddress, accountFieldName),
            "provided attestation party have not access to this field verification");

        uint rewardAmount = context.getVerificationPriceList().getPrice(accountFieldName);

        BaseVerification createdContract = new BaseVerification(_storage, rewardAmount, account, msg.sender, dataIndex, accountFieldName);
        createdContract.transferOwnership(attestationPartyAddress);

        address createdContractAddress = address(createdContract);
        createdContracts[createdContractAddress] = true;
        contracts[key] = createdContractAddress;
        context.getKimlicToken().transferFrom(msg.sender, createdContractAddress, rewardAmount);
        
        context.getAccountStorageAdapter().setFieldVerificationContractAddress(account, accountFieldName, dataIndex, createdContractAddress);
    }
}
