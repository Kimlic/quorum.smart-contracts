pragma solidity ^0.4.23;


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
    AccountStorage public accountStorage;

    AccountStorageAdapter public accountStorageAdapter;

    KimlicToken public kimlicToken;

    ProvisioningPrice public provisioningPrice;

    ProvisioningContractFactory public provisioningContractFactory;

    VerificationContractFactory public verificationContractFactory;

    address public communityTokenWalletAddress;

    RewardingContract public rewardingContract;

    /// public methods ///
    function setAccountStorage(address accountStorageAddress) public onlyOwner() {
        accountStorage = AccountStorage(accountStorageAddress);
    }

    function setAccountStorageAdapter(address accountStorageAdapterAddress) public onlyOwner() {
        accountStorageAdapter = AccountStorageAdapter(accountStorageAdapterAddress);
    }

    function setKimlicToken(address kimlicTokenAddress) public onlyOwner() {
        kimlicToken = KimlicToken(kimlicTokenAddress);
    }

    function setVerificationContractFactory(address verificationContractFactoryAddress) public onlyOwner() {
        verificationContractFactory = VerificationContractFactory(verificationContractFactoryAddress);
    }

    function setProvisioningPrice(address provisioningPriceAddress) public onlyOwner() {
        provisioningPrice = ProvisioningPrice(provisioningPriceAddress);
    }

    function setProvisioningContractFactory(address provisioningContractFactoryAddress) public onlyOwner() {
        provisioningContractFactory = ProvisioningContractFactory(provisioningContractFactoryAddress);
    }

    function setCommunityTokenWalletAddress(address communityTokenWalletAddressAddress) public onlyOwner() {
        communityTokenWalletAddress = ProvisioningContractFactory(communityTokenWalletAddressAddress);
    }

    function setRewardingContract(address rewardingContractAddress) public onlyOwner() {
        rewardingContract = RewardingContract(rewardingContractAddress);
    }
}