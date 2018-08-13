pragma solidity ^0.4.23;

import "./KimlicContractsContext.sol";
import "./ProvisioningContract.sol";
import "./WithKimlicContext.sol";

/// @title Factory contract for data provisioning process
/// @author Bohdan Grytsenko
/// @notice Produces provisioning contract for each case of client attribute consumption by Relying party
contract ProvisioningContractFactory is WithKimlicContext {
    /// public attributes ///
    mapping(address=>bool) public createdContracts;
    mapping(string=>address) private contracts;
    
    /// private attributes ///
    mapping(string=>uint8) private _communityTokenWalletInterestPercent;
    mapping(string=>uint8) private _kimlicWalletInterestPercent;
    mapping(string=>uint8) private _accountInterestPercent;
    mapping(string=>uint8) private _coOwnerInterestPercent;
    mapping(string=>uint) private tokensLockPeriod;

    /// Constructors ///
    constructor (address contextStorage) public WithKimlicContext(contextStorage) {
    }

    /// @notice returns tokens lock period for specific attribute
    /// @param filedName attribute code
    /// @return tokens lock period for specific attribute in seconds
    function getTokensLockPeriod(string filedName) view public returns (uint) {
        return tokensLockPeriod[filedName];
    }

    /// @notice defines tokens lock period for specific attribute
    /// @param filedName attribute code
    /// @param lockPeriod tokens lock period for specific attribute in seconds
    function setTokensLockPeriod(string filedName, uint lockPeriod) public returns (uint) {
        tokensLockPeriod[filedName] = lockPeriod;
    }

    /// @notice creates provisioning contract for specific client and attribute
    /// @param account user account address
    /// @param accountFieldName attribute code
    /// @param key random string, used to receive created contract address
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

    /// @notice defines cashflow split for specific atttribute
    /// @param attributeName attribute code
    /// @param communityTokenWallet casflow split for community token wallet
    /// @param coOwner casflow split for verification co-owner
    /// @param kimlicWallet cashflow split for Kimlic wallet
    /// @param attributeName cashflow split for user account
    function setInterestsPercent(string attributeName, uint8 communityTokenWallet, uint8 coOwner, uint8 kimlicWallet, uint8 account) public {
        require((communityTokenWallet + kimlicWallet + account + coOwner) == 100);

        _communityTokenWalletInterestPercent[attributeName] = communityTokenWallet;
        _kimlicWalletInterestPercent[attributeName] = kimlicWallet;
        _accountInterestPercent[attributeName] = account;
        _coOwnerInterestPercent[attributeName] = coOwner;
    }

    /// @notice returns address of created contract
    /// @param key random string speficied at creation
    function getProvisioningContract(string key) view public returns (address) {
        return contracts[key];
    }

    /// @notice returns cashflow split for CommunityToken wallet
    /// @param fieldName attribute code
    /// @return casflow split for community token wallet
    function getCommunityTokenWalletInterestPercent(string fieldName) public view returns(uint8) {
        return _communityTokenWalletInterestPercent[fieldName];
    }

    /// @notice returns cashflow split for Kimlic wallet
    /// @param fieldName attribute code
    /// @return casflow split for Kimlic token wallet
    function getKimlicWalletInterestPercent(string fieldName) public view returns(uint8) {
        return _kimlicWalletInterestPercent[fieldName];
    }

    /// @notice returns cashflow split for user account
    /// @param fieldName attribute code
    /// @return casflow split for user account
    function getAccountInterestPercent(string fieldName) public view returns(uint8) {
        return _accountInterestPercent[fieldName];
    }

    /// @notice returns cashflow split for verification co-owner
    /// @param fieldName attribute code
    /// @return casflow split for verification co-owner
    function getCoOwnerInterestPercent(string fieldName) public view returns(uint8) {
        return _coOwnerInterestPercent[fieldName];
    }
}