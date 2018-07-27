pragma solidity ^0.4.23;


import "./KimlicContextStorage.sol";
import "./openzeppelin-solidity/Ownable.sol";
import "./AccountStorage.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicToken.sol";
import "./PriceList.sol";
import "./ProvisioningContractFactory.sol";
import "./VerificationContractFactory.sol";
import "./BaseStorage.sol";
import "./RewardingContract.sol";
import "./RelyingPartyStorageAdapter.sol";
import "./RelyingPartyStorage.sol";
import "./AttestationPartyStorageAdapter.sol";
import "./AttestationPartyStorage.sol";

contract KimlicContractsContext is Ownable {
    
    /// public attributes ///

    /// private attributes ///
    bytes32 private accountStorageAdapterKey;
    bytes32 private kimlicTokenKey;
    bytes32 private verificationContractFactoryKey;
    bytes32 private provisioningPriceKey;
    bytes32 private verificationPriceListKey;
    bytes32 private provisioningContractFactoryKey;
    bytes32 private communityTokenWalletAddressKey;
    bytes32 private rewardingContractKey;
    bytes32 private accountStorageKey;
    bytes32 private relyingPartyStorageAdapterKey;
    bytes32 private relyingPartyStorageKey;
    bytes32 private attestationPartyStorageAdapterKey;
    bytes32 private attestationPartyStorageKey;
    bytes32 private kimlicWalletAddressKey;
    KimlicContextStorage internal _storage;

    /// constructors ///
    constructor(address storageAddress) public Ownable() {
        _storage = KimlicContextStorage(storageAddress);

        accountStorageAdapterKey = keccak256(abi.encode("accountStorageAdapter"));
        kimlicTokenKey = keccak256(abi.encode("kimlicToken"));
        verificationContractFactoryKey = keccak256(abi.encode("verificationContractFactory"));
        provisioningPriceKey = keccak256(abi.encode("provisioningPrice"));
        verificationPriceListKey = keccak256(abi.encode("verificationPriceList"));
        provisioningContractFactoryKey = keccak256(abi.encode("provisioningContractFactory"));
        communityTokenWalletAddressKey = keccak256(abi.encode("communityTokenWalletAddress"));
        rewardingContractKey = keccak256(abi.encode("rewardingContract"));
        accountStorageKey = keccak256(abi.encode("accountStorage"));
        relyingPartyStorageAdapterKey = keccak256(abi.encode("relyingPartyStorageAdapter"));
        relyingPartyStorageKey = keccak256(abi.encode("relyingPartyStorage"));
        attestationPartyStorageAdapterKey = keccak256(abi.encode("attestationPartyStorageAdapter"));
        attestationPartyStorageKey = keccak256(abi.encode("attestationPartyStorage"));
        kimlicWalletAddressKey = keccak256(abi.encode("kimlicWalletAddress"));
    }

    /// public methods ///

    /* Getters */
    function getAccountStorageAdapter() public view returns(AccountStorageAdapter accountStorageAdapter) {
        accountStorageAdapter = AccountStorageAdapter(_storage.getAddress(accountStorageAdapterKey));
    }

    function getKimlicToken() public view returns(KimlicToken kimlicToken) {
        kimlicToken = KimlicToken(_storage.getAddress(kimlicTokenKey));
    }

    function getVerificationContractFactory() public view returns(VerificationContractFactory verificationContractFactory) {
        verificationContractFactory = VerificationContractFactory(_storage.getAddress(verificationContractFactoryKey));
    }

    function getProvisioningPriceList() public view returns(PriceList provisioningPriceList) {
        provisioningPriceList = PriceList(_storage.getAddress(provisioningPriceKey));
    }

    function getVerificationPriceList() public view returns(PriceList verificationPriceList) {
        verificationPriceList = PriceList(_storage.getAddress(verificationPriceListKey));
    }

    function getProvisioningContractFactory() public view returns(ProvisioningContractFactory provisioningContractFactory) {
        provisioningContractFactory = ProvisioningContractFactory(_storage.getAddress(provisioningContractFactoryKey));
    }

    function getCommunityTokenWalletAddress() public view returns(address communityTokenWalletAddress) {
        communityTokenWalletAddress = _storage.getAddress(communityTokenWalletAddressKey);
    }

    function getRewardingContract() public view returns(RewardingContract rewardingContract) {
        rewardingContract = RewardingContract(_storage.getAddress(rewardingContractKey));
    }

    function getAccountStorage() public view returns(AccountStorage accountStorage) {
        accountStorage = AccountStorage(_storage.getAddress(accountStorageKey));
    }

    function getRelyingPartyStorageAdapter() public view returns(RelyingPartyStorageAdapter relyingPartyStorageAdapter) {
        relyingPartyStorageAdapter = RelyingPartyStorageAdapter(_storage.getAddress(relyingPartyStorageAdapterKey));
    }

    function getRelyingPartyStorage() public view returns(RelyingPartyStorage relyingPartyStorage) {
        relyingPartyStorage = RelyingPartyStorage(_storage.getAddress(relyingPartyStorageKey));
    }

    function getAttestationPartyStorageAdapter() public view returns(AttestationPartyStorageAdapter attestationPartyStorageAdapter) {
        attestationPartyStorageAdapter = AttestationPartyStorageAdapter(_storage.getAddress(attestationPartyStorageAdapterKey));
    }

    function getAttestationPartyStorage() public view returns(AttestationPartyStorage attestationPartyStorage) {
        attestationPartyStorage = AttestationPartyStorage(_storage.getAddress(attestationPartyStorageKey));
    }

    function getKimlicWalletAddress() public view returns(address kimlicWalletAddress) {
        kimlicWalletAddress = _storage.getAddress(kimlicWalletAddressKey);
    }


    /* Setters */
    function setAccountStorageAdapter(address accountStorageAdapterAddress) public onlyOwner() {
        _storage.setAddress(accountStorageAdapterKey, accountStorageAdapterAddress);
    }

    function setKimlicToken(address kimlicTokenAddress) public onlyOwner() {
        _storage.setAddress(kimlicTokenKey, kimlicTokenAddress);
    }

    function setVerificationContractFactory(address verificationContractFactoryAddress) public onlyOwner() {
        _storage.setAddress(verificationContractFactoryKey, verificationContractFactoryAddress);
    }

    function setProvisioningPriceList(address provisioningPriceListAddress) public onlyOwner() {
        _storage.setAddress(provisioningPriceKey, provisioningPriceListAddress);
    }

    function setVerificationPriceList(address verificationPriceListAddress) public onlyOwner() {
        _storage.setAddress(verificationPriceListKey, verificationPriceListAddress);
    }

    function setProvisioningContractFactory(address provisioningContractFactoryAddress) public onlyOwner() {
        _storage.setAddress(provisioningContractFactoryKey, provisioningContractFactoryAddress);
    }

    function setCommunityTokenWalletAddress(address communityTokenWalletAddressAddress) public onlyOwner() {
        _storage.setAddress(communityTokenWalletAddressKey, communityTokenWalletAddressAddress);
    }

    function setRewardingContract(address rewardingContractAddress) public onlyOwner() {
        _storage.setAddress(rewardingContractKey, rewardingContractAddress);
    }

    function setAccountStorage(address accountStorageAddress) public onlyOwner() {
        _storage.setAddress(accountStorageKey, accountStorageAddress);
    }
    
    function setRelyingPartyStorageAdapter(address relyingPartyStorageAdapterAddress) public {
        _storage.setAddress(relyingPartyStorageAdapterKey, relyingPartyStorageAdapterAddress);
    }

    function setRelyingPartyStorage(address relyingPartyStorageAddress) public {
        _storage.setAddress(relyingPartyStorageKey, relyingPartyStorageAddress);
    }

    function setAttestationPartyStorageAdapter(address attestationPartyStorageAdapterAddress) public {
        _storage.setAddress(attestationPartyStorageAdapterKey, attestationPartyStorageAdapterAddress);
    }

    function setAttestationPartyStorage(address attestationPartyStorageAddress) public {
        _storage.setAddress(attestationPartyStorageKey, attestationPartyStorageAddress);
    }

    function setKimlicWalletAddress(address kimlicWalletAddress) public {
        _storage.setAddress(kimlicWalletAddressKey, kimlicWalletAddress);
    }
}