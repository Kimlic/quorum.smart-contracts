pragma solidity ^0.4.23;


import "./KimlicContextStorage.sol";
import "./openzeppelin-solidity/Ownable.sol";
import "./AccountStorage.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicToken.sol";
import "./ProvisioningPrice.sol";
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
    string private constant accountStorageAdapterKey = "accountStorageAdapter";
    string private constant kimlicTokenKey = "kimlicToken";
    string private constant verificationContractFactoryKey = "verificationContractFactory";
    string private constant provisioningPriceKey = "provisioningPrice";
    string private constant provisioningContractFactoryKey = "provisioningContractFactory";
    string private constant communityTokenWalletAddressKey = "communityTokenWalletAddress";
    string private constant rewardingContractKey = "rewardingContract";
    string private constant accountStorageKey = "accountStorage";
    string private constant relyingPartyStorageAdapterKey = "relyingPartyStorageAdapter";
    string private constant relyingPartyStorageKey = "relyingPartyStorage";
    string private constant attestationPartyStorageAdapterKey = "attestationPartyStorageAdapter";
    string private constant attestationPartyStorageKey = "attestationPartyStorage";
    KimlicContextStorage internal _storage;

    /// constructors ///
    constructor(address storageAddress) public Ownable() {
        _storage = KimlicContextStorage(storageAddress);
    }

    /// public methods ///

    /* Getters */
    function getAccountStorageAdapter() public view returns(AccountStorageAdapter accountStorageAdapter) {
        accountStorageAdapter = AccountStorageAdapter(_storage.getAddress(keccak256(accountStorageAdapterKey)));
    }

    function getKimlicToken() public view returns(KimlicToken kimlicToken) {
        kimlicToken = KimlicToken(_storage.getAddress(keccak256(kimlicTokenKey)));
    }

    function getVerificationContractFactory() public view returns(VerificationContractFactory verificationContractFactory) {
        verificationContractFactory = VerificationContractFactory(_storage.getAddress(keccak256(verificationContractFactoryKey)));
    }

    function getProvisioningPrice() public view returns(ProvisioningPrice provisioningPrice) {
        provisioningPrice = ProvisioningPrice(_storage.getAddress(keccak256(provisioningPriceKey)));
    }

    function getProvisioningContractFactory() public view returns(ProvisioningContractFactory provisioningContractFactory) {
        provisioningContractFactory = ProvisioningContractFactory(_storage.getAddress(keccak256(provisioningContractFactoryKey)));
    }

    function getCommunityTokenWalletAddress() public view returns(address communityTokenWalletAddress) {
        communityTokenWalletAddress = _storage.getAddress(keccak256(communityTokenWalletAddressKey));
    }

    function getRewardingContract() public view returns(RewardingContract rewardingContract) {
        rewardingContract = RewardingContract(_storage.getAddress(keccak256(rewardingContractKey)));
    }

    function getAccountStorage() public view returns(AccountStorage accountStorage) {
        accountStorage = AccountStorage(_storage.getAddress(keccak256(accountStorageKey)));
    }

    function getRelyingPartyStorageAdapter() public view returns(RelyingPartyStorageAdapter relyingPartyStorageAdapter) {
        relyingPartyStorageAdapter = RelyingPartyStorageAdapter(_storage.getAddress(keccak256(relyingPartyStorageAdapterKey)));
    }

    function getRelyingPartyStorage() public view returns(RelyingPartyStorage relyingPartyStorage) {
        relyingPartyStorage = RelyingPartyStorage(_storage.getAddress(keccak256(relyingPartyStorageKey)));
    }

    function getAttestationPartyStorageAdapter() public view returns(AttestationPartyStorageAdapter attestationPartyStorageAdapter) {
        attestationPartyStorageAdapter = AttestationPartyStorageAdapter(_storage.getAddress(keccak256(attestationPartyStorageAdapterKey)));
    }

    function getAttestationPartyStorage() public view returns(AttestationPartyStorage attestationPartyStorage) {
        attestationPartyStorage = AttestationPartyStorage(_storage.getAddress(keccak256(attestationPartyStorageKey)));
    }


    /* Setters */
    function setAccountStorageAdapter(address accountStorageAdapterAddress) public onlyOwner() {
        _storage.setAddress(keccak256(accountStorageAdapterKey), accountStorageAdapterAddress);
    }

    function setKimlicToken(address kimlicTokenAddress) public onlyOwner() {
        _storage.setAddress(keccak256(kimlicTokenKey), kimlicTokenAddress);
    }

    function setVerificationContractFactory(address verificationContractFactoryAddress) public onlyOwner() {
        _storage.setAddress(keccak256(verificationContractFactoryKey), verificationContractFactoryAddress);
    }

    function setProvisioningPrice(address provisioningPriceAddress) public onlyOwner() {
        _storage.setAddress(keccak256(provisioningPriceKey), provisioningPriceAddress);
    }

    function setProvisioningContractFactory(address provisioningContractFactoryAddress) public onlyOwner() {
        _storage.setAddress(keccak256(provisioningContractFactoryKey), provisioningContractFactoryAddress);
    }

    function setCommunityTokenWalletAddress(address communityTokenWalletAddressAddress) public onlyOwner() {
        _storage.setAddress(keccak256(communityTokenWalletAddressKey), communityTokenWalletAddressAddress);
    }

    function setRewardingContract(address rewardingContractAddress) public onlyOwner() {
        _storage.setAddress(keccak256(rewardingContractKey), rewardingContractAddress);
    }

    function setAccountStorage(address accountStorageAddress) public onlyOwner() {
        _storage.setAddress(keccak256(accountStorageKey), accountStorageAddress);
    }
    
    function setRelyingPartyStorageAdapterStorage(address relyingPartyStorageAdapterAddress) public {
        _storage.setAddress(keccak256(relyingPartyStorageAdapterKey), relyingPartyStorageAdapterAddress);
    }

    function setRelyingPartyStorage(address relyingPartyStorageAddress) public {
        _storage.setAddress(keccak256(relyingPartyStorageKey), relyingPartyStorageAddress);
    }

    function setAttestationPartyStorageAdapter(address attestationPartyStorageAdapterAddress) public {
        _storage.setAddress(keccak256(attestationPartyStorageAdapterKey), attestationPartyStorageAdapterAddress);
    }

    function setAttestationPartyStorage(address attestationPartyStorageAddress) public {
        _storage.setAddress(keccak256(attestationPartyStorageKey), attestationPartyStorageAddress);
    }
}