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

contract KimlicContractsContext is Ownable {
    
    /// public attributes ///

    /// private attributes ///
    string private accountStorageAdapterKey = "accountStorageAdapter";
    string private kimlicTokenKey = "kimlicToken";
    string private verificationContractFactoryKey = "verificationContractFactory";
    string private provisioningPriceKey = "provisioningPrice";
    string private provisioningContractFactoryKey = "provisioningContractFactory";
    string private communityTokenWalletAddressKey = "communityTokenWalletAddress";
    string private rewardingContractKey = "rewardingContract";
    string private accountStorageKey = "accountStorage";
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
    

    /* Setters */
    function setAccountStorageAdapter(address accountStorageAdapterAddress) public onlyOwner() {
        _storage.setAddress(keccak256("accountStorageAdapter"), accountStorageAdapterAddress);
    }

    function setKimlicToken(address kimlicTokenAddress) public onlyOwner() {
        _storage.setAddress(keccak256("kimlicToken"), kimlicTokenAddress);
    }

    function setVerificationContractFactory(address verificationContractFactoryAddress) public onlyOwner() {
        _storage.setAddress(keccak256("verificationContractFactory"), verificationContractFactoryAddress);
    }

    function setProvisioningPrice(address provisioningPriceAddress) public onlyOwner() {
        _storage.setAddress(keccak256("provisioningPrice"), provisioningPriceAddress);
    }

    function setProvisioningContractFactory(address provisioningContractFactoryAddress) public onlyOwner() {
        _storage.setAddress(keccak256("provisioningContractFactory"), provisioningContractFactoryAddress);
    }

    function setCommunityTokenWalletAddress(address communityTokenWalletAddressAddress) public onlyOwner() {
        _storage.setAddress(keccak256("communityTokenWalletAddress"), communityTokenWalletAddressAddress);
    }

    function setRewardingContract(address rewardingContractAddress) public onlyOwner() {
        _storage.setAddress(keccak256("rewardingContract"), rewardingContractAddress);
    }

    function setAccountStorage(address accountStorageAddress) public onlyOwner() {
        _storage.setAddress(keccak256("accountStorage"), accountStorageAddress);
    }
}