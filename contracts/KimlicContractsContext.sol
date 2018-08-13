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

/// @title Services discovery contract
/// @author Bohdan Grytsenko
/// @notice Used during deployment to store addresses of other contracts, during runtime - single point where platform member can get address of any contract he needs
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

    /**** Get Methods ***********/

    /// @notice accessor for AccountStorageAdapter address
    /// @return accountStorageAdapter AccountStorageAdapter address
    function getAccountStorageAdapter() public view returns(AccountStorageAdapter accountStorageAdapter) {
        accountStorageAdapter = AccountStorageAdapter(_storage.getAddress(accountStorageAdapterKey));
    }

    /// @notice accessor for KimlicToken address
    /// @return kimlicToken KimlicToken address
    function getKimlicToken() public view returns(KimlicToken kimlicToken) {
        kimlicToken = KimlicToken(_storage.getAddress(kimlicTokenKey));
    }

    /// @notice accessor for VerificationContractFactory address
    /// @return verificationContractFactory VerificationContractFactory address
    function getVerificationContractFactory() public view returns(VerificationContractFactory verificationContractFactory) {
        verificationContractFactory = VerificationContractFactory(_storage.getAddress(verificationContractFactoryKey));
    }

    /// @notice accessor for PriceList address
    /// @return provisioningPriceList PriceList address
    function getProvisioningPriceList() public view returns(PriceList provisioningPriceList) {
        provisioningPriceList = PriceList(_storage.getAddress(provisioningPriceKey));
    }

    /// @notice accessor for PriceList address
    /// @return verificationPriceListKey PriceList address
    function getVerificationPriceList() public view returns(PriceList verificationPriceList) {
        verificationPriceList = PriceList(_storage.getAddress(verificationPriceListKey));
    }

    /// @notice accessor for ProvisioningContractFactory address
    /// @return provisioningContractFactory ProvisioningContractFactory address
    function getProvisioningContractFactory() public view returns(ProvisioningContractFactory provisioningContractFactory) {
        provisioningContractFactory = ProvisioningContractFactory(_storage.getAddress(provisioningContractFactoryKey));
    }

    /// @notice accessor for CommunityTokenWallet address
    /// @return communityTokenWalletAddress CommunityTokenWallet address
    function getCommunityTokenWalletAddress() public view returns(address communityTokenWalletAddress) {
        communityTokenWalletAddress = _storage.getAddress(communityTokenWalletAddressKey);
    }

    /// @notice accessor for RewardingContract address
    /// @return rewardingContract RewardingContract address
    function getRewardingContract() public view returns(RewardingContract rewardingContract) {
        rewardingContract = RewardingContract(_storage.getAddress(rewardingContractKey));
    }

    /// @notice accessor for AccountStorage address
    /// @return accountStorage AccountStorage address
    function getAccountStorage() public view returns(AccountStorage accountStorage) {
        accountStorage = AccountStorage(_storage.getAddress(accountStorageKey));
    }

    /// @notice accessor for RelyingPartyStorageAdapter address
    /// @return relyingPartyStorageAdapter RelyingPartyStorageAdapter address
    function getRelyingPartyStorageAdapter() public view returns(RelyingPartyStorageAdapter relyingPartyStorageAdapter) {
        relyingPartyStorageAdapter = RelyingPartyStorageAdapter(_storage.getAddress(relyingPartyStorageAdapterKey));
    }

    /// @notice accessor for RelyingPartyStorage address
    /// @return relyingPartyStorage RelyingPartyStorage address
    function getRelyingPartyStorage() public view returns(RelyingPartyStorage relyingPartyStorage) {
        relyingPartyStorage = RelyingPartyStorage(_storage.getAddress(relyingPartyStorageKey));
    }

    /// @notice accessor for AttestationPartyStorageAdapter address
    /// @return attestationPartyStorageAdapter AttestationPartyStorageAdapter address
    function getAttestationPartyStorageAdapter() public view returns(AttestationPartyStorageAdapter attestationPartyStorageAdapter) {
        attestationPartyStorageAdapter = AttestationPartyStorageAdapter(_storage.getAddress(attestationPartyStorageAdapterKey));
    }

    /// @notice accessor for AttestationPartyStorage address
    /// @return attestationPartyStorage AttestationPartyStorage address
    function getAttestationPartyStorage() public view returns(AttestationPartyStorage attestationPartyStorage) {
        attestationPartyStorage = AttestationPartyStorage(_storage.getAddress(attestationPartyStorageKey));
    }

    /// @notice accessor for KimlicWallet address
    /// @return kimlicWalletAddress KimlicWallet
    function getKimlicWalletAddress() public view returns(address kimlicWalletAddress) {
        kimlicWalletAddress = _storage.getAddress(kimlicWalletAddressKey);
    }


    /* Setters */

    /// @notice modifier for AccountStorageAdapter address
    /// @param accountStorageAdapterAddress AccountStorageAdapter address
    function setAccountStorageAdapter(address accountStorageAdapterAddress) public onlyOwner() {
        _storage.setAddress(accountStorageAdapterKey, accountStorageAdapterAddress);
    }

    /// @notice modifier for KimlicToken address
    /// @param kimlicTokenAddress KimlicToken address
    function setKimlicToken(address kimlicTokenAddress) public onlyOwner() {
        _storage.setAddress(kimlicTokenKey, kimlicTokenAddress);
    }

    /// @notice modifier for VerificationContractFactory address
    /// @param verificationContractFactoryAddress VerificationContractFactory address
    function setVerificationContractFactory(address verificationContractFactoryAddress) public onlyOwner() {
        _storage.setAddress(verificationContractFactoryKey, verificationContractFactoryAddress);
    }

    /// @notice modifier for ProvisioningPriceList address
    /// @param provisioningPriceListAddress ProvisioningPriceList address
    function setProvisioningPriceList(address provisioningPriceListAddress) public onlyOwner() {
        _storage.setAddress(provisioningPriceKey, provisioningPriceListAddress);
    }

    /// @notice modifier for VerificationPriceList address
    /// @param verificationPriceListAddress VerificationPriceList address
    function setVerificationPriceList(address verificationPriceListAddress) public onlyOwner() {
        _storage.setAddress(verificationPriceListKey, verificationPriceListAddress);
    }

    /// @notice modifier for ProvisioningContractFactory address
    /// @param provisioningContractFactoryAddress ProvisioningContractFactory address
    function setProvisioningContractFactory(address provisioningContractFactoryAddress) public onlyOwner() {
        _storage.setAddress(provisioningContractFactoryKey, provisioningContractFactoryAddress);
    }

    /// @notice modifier for CommunityTokenWallet address
    /// @param communityTokenWalletAddressAddress CommunityTokenWallet address
    function setCommunityTokenWalletAddress(address communityTokenWalletAddressAddress) public onlyOwner() {
        _storage.setAddress(communityTokenWalletAddressKey, communityTokenWalletAddressAddress);
    }

    /// @notice modifier for RewardingContract address
    /// @param rewardingContractAddress RewardingContract address
    function setRewardingContract(address rewardingContractAddress) public onlyOwner() {
        _storage.setAddress(rewardingContractKey, rewardingContractAddress);
    }

    /// @notice modifier for AccountStorage address
    /// @param accountStorageAddress AccountStorage address
    function setAccountStorage(address accountStorageAddress) public onlyOwner() {
        _storage.setAddress(accountStorageKey, accountStorageAddress);
    }
    
    /// @notice modifier for RelyingPartyStorageAdapter address
    /// @param relyingPartyStorageAdapterAddress RelyingPartyStorageAdapter address
    function setRelyingPartyStorageAdapter(address relyingPartyStorageAdapterAddress) public  onlyOwner() {
        _storage.setAddress(relyingPartyStorageAdapterKey, relyingPartyStorageAdapterAddress);
    }

    /// @notice modifier for RelyingPartyStorageAdapter address
    /// @param relyingPartyStorageAddress RelyingPartyStorageAdapter address
    function setRelyingPartyStorage(address relyingPartyStorageAddress) public  onlyOwner() {
        _storage.setAddress(relyingPartyStorageKey, relyingPartyStorageAddress);
    }

    /// @notice modifier for AttestationPartyStorageAdapter address
    /// @param attestationPartyStorageAdapterAddress AttestationPartyStorageAdapter address
    function setAttestationPartyStorageAdapter(address attestationPartyStorageAdapterAddress) public  onlyOwner() {
        _storage.setAddress(attestationPartyStorageAdapterKey, attestationPartyStorageAdapterAddress);
    }

    /// @notice modifier for AttestationPartyStorage address
    /// @param attestationPartyStorageAddress AttestationPartyStorage address
    function setAttestationPartyStorage(address attestationPartyStorageAddress) public  onlyOwner() {
        _storage.setAddress(attestationPartyStorageKey, attestationPartyStorageAddress);
    }

    /// @notice modifier for KimlicWallet address
    /// @param kimlicWalletAddress KimlicWallet address
    function setKimlicWalletAddress(address kimlicWalletAddress) public  onlyOwner() {
        _storage.setAddress(kimlicWalletAddressKey, kimlicWalletAddress);
    }
}