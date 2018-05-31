pragma solidity ^0.4.23;


import "./Ownable.sol";
import "./BaseStorage.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicToken.sol";
import "./ProvisioningPrice.sol";
import "./ProvisioningContractFactory.sol";

contract KimlicContractsContext is Ownable {
    
    BaseStorage public accountStorage;

    AccountStorageAdapter public accountStorageAdapter;

    KimlicToken public kimlicToken;

    ProvisioningPrice public provisioningPrice;

    ProvisioningContractFactory public provisioningContractFactory;

    address public verificationFactory;

    address public provisionContractFactory;

    constructor (address accountStorageAddress) public {
        accountStorage = BaseStorage(accountStorageAddress);
    }

    function setAccountStorageAdapter(address accountStorageAdapterAddress) public onlyOwner() {
        accountStorageAdapter = AccountStorageAdapter(accountStorageAdapterAddress);
    }

    function setKimlicToken(address kimlicTokenAddress) public onlyOwner() {
        kimlicToken = KimlicToken(kimlicTokenAddress);
    }

    function setProvisionContractFactory(address provisionContractFactoryAddress) public onlyOwner() {
        provisionContractFactory = provisionContractFactoryAddress;
    }

    function setVerificationFactory(address verificationFactoryAddress) public onlyOwner() {
        verificationFactory = verificationFactoryAddress;
    }

    function setProvisioningPrice(address provisioningPriceAddress) public onlyOwner() {
        provisioningPrice = provisioningPriceAddress;
    }

    function setprovisioningContractFactory(address provisioningContractFactoryAddress) public onlyOwner() {
        provisioningContractFactory = provisioningContractFactoryAddress;
    }
}