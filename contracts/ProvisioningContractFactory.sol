pragma solidity ^0.4.23;

import "./KimlicContractsContext.sol";
import "./ProvisioningContract.sol";
import "./WithKimlicContext.sol";

contract ProvisioningContractFactory is WithKimlicContext {
    /// public attributes ///
    mapping(address=>bool) public createdContracts;
    uint public tokensLockPeriod;
    mapping(string=>address) private contracts;
    
    /// private attributes ///
    mapping(string=>uint8) private _communityTokenWalletInterestPercent;
    mapping(string=>uint8) private _kimlicWalletInterestPercent;
    mapping(string=>uint8) private _accountInterestPercent;
    mapping(string=>uint8) private _coOwnerInterestPercent;

    /// Constructors ///
    constructor (address contextStorage) public WithKimlicContext(contextStorage) {
    }

    /// public methods ///
    function createProvisioningContract(address account, string accountFieldName, string key) 
            public returns(ProvisioningContract createdContract) {
        
        KimlicContractsContext context = getContext();
        uint reward = context.getProvisioningPriceList().getPrice(accountFieldName);
        uint dataIndex = context.getAccountStorageAdapter().getFieldHistoryLength(account, accountFieldName);
        require(dataIndex > 0, "Data is empty");

        createdContract = new ProvisioningContract(_storage, account, accountFieldName, dataIndex, reward);
        createdContract.transferOwnership(msg.sender);
        address createdContractAddress = address(createdContract);
        createdContracts[createdContractAddress] = true;
        contracts[key] = createdContractAddress;

        context.getKimlicToken().transferFrom(msg.sender, createdContractAddress, reward);
    }

    function setInterestsPercent(string attributeName, uint8 communityTokenWallet, uint8 coOwner, uint8 kimlicWallet, uint8 account) public {
        require((communityTokenWallet + kimlicWallet + account + coOwner) == 100);

        _communityTokenWalletInterestPercent[attributeName] = communityTokenWallet;
        _kimlicWalletInterestPercent[attributeName] = kimlicWallet;
        _accountInterestPercent[attributeName] = account;
        _coOwnerInterestPercent[attributeName] = coOwner;
    }

    function setTokensLockPeriod(uint lockPeriod) public {
        tokensLockPeriod = lockPeriod;
    }

    function getProvisioningContract(string key) view public returns (address) {
        return contracts[key];
    }

    function getCommunityTokenWalletInterestPercent(string fieldName) public view returns(uint8) {
        return _communityTokenWalletInterestPercent[fieldName];
    }

    function getKimlicWalletInterestPercent(string fieldName) public view returns(uint8) {
        return _kimlicWalletInterestPercent[fieldName];
    }

    function getAccountInterestPercent(string fieldName) public view returns(uint8) {
        return _accountInterestPercent[fieldName];
    }

    function getCoOwnerInterestPercent(string fieldName) public view returns(uint8) {
        return _coOwnerInterestPercent[fieldName];
    }
}