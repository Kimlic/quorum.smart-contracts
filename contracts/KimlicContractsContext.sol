pragma solidity ^0.4.23;


import "./Ownable.sol";
import "./BaseStorage.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicToken.sol";
import "./ProvisioningPrice.sol";
import "./ProvisioningContractFactory.sol";
import "./VerificationContractFactory.sol";
import "./BaseStorage.sol";

contract KimlicContractsContext is Ownable {
    
    BaseStorage public accountStorage;

    AccountStorageAdapter public accountStorageAdapter;

    KimlicToken public kimlicToken;

    ProvisioningPrice public provisioningPrice;

    ProvisioningContractFactory public provisioningContractFactory;

    VerificationContractFactory public verificationContractFactory;

    address public communityTokenWalletAddress;

    function setAccountStorage(address accountStorageAddress) public onlyOwner() {
        accountStorage = BaseStorage(accountStorageAddress);
    }

    function setAccountStorageAdapter(address accountStorageAdapterAddress) public onlyOwner() {
        accountStorageAdapter = AccountStorageAdapter(accountStorageAdapterAddress);
    }

    function setKimlicToken(address kimlicTokenAddress) public onlyOwner() {
        kimlicToken = KimlicToken(kimlicTokenAddress);
    }

    function vetVerificationContractFactory(address verificationContractFactoryAddress) public onlyOwner() {
        verificationContractFactory = VerificationContractFactory(verificationContractFactoryAddress);
    }

    function setProvisioningPrice(address provisioningPriceAddress) public onlyOwner() {
        provisioningPrice = ProvisioningPrice(provisioningPriceAddress);
    }

    function setprovisioningContractFactory(address provisioningContractFactoryAddress) public onlyOwner() {
        provisioningContractFactory = ProvisioningContractFactory(provisioningContractFactoryAddress);
    }

    function setCommunityTokenWalletAddress(address communityTokenWalletAddressAddress) public onlyOwner() {
        communityTokenWalletAddress = ProvisioningContractFactory(communityTokenWalletAddressAddress);
    }    
}