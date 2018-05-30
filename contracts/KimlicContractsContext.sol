pragma solidity ^0.4.23;


import "./Ownable.sol";
import "./BaseStorage.sol";
import "./AccountStorageAdapter.sol";
import "./KimlicToken.sol";

contract KimlicContractsContext is Ownable {
    
    BaseStorage public accountStorage;

    AccountStorageAdapter public accountStorageAdapter;

    KimlicToken public kimlicToken;

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
}