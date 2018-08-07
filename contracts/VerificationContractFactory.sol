pragma solidity ^0.4.23;


import "./openzeppelin-solidity/Ownable.sol";
import "./BaseVerification.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicContractsContext.sol";
import "./WithKimlicContext.sol";
import "./KimlicToken.sol";

contract VerificationContractFactory is WithKimlicContext {
    /// public attributes ///
    mapping(address=>bool) public createdContracts;

    /// private attributes ///
    mapping(string=>address) private contracts;
    mapping(string=>uint) private tokensLockPeriod;

    /// Constructors ///
    constructor(address contextStorage) public WithKimlicContext(contextStorage) {
    }

    /// public methods ///
    function getTokensLockPeriod(string filedName) view public returns (uint) {
        return tokensLockPeriod[filedName];
    }

    function setTokensLockPeriod(string filedName, uint lockPeriod) public returns (uint) {
        tokensLockPeriod[filedName] = lockPeriod;
    }

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
