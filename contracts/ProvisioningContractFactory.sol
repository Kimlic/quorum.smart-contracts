pragma solidity ^0.4.23;

import "./KimlicContractsContext.sol";
import "./ProvisioningContract.sol";
import "./WithKimlicContext.sol";

contract ProvisioningContractFactory is WithKimlicContext {
    /// public attributes ///
    mapping(address=>bool) public createdContracts;
    uint8 public communityTokenWalletInterestPercent;
    uint8 public attestationPartyInterestPercent;
    uint8 public accountInterestPercent;
    uint8 public coOwnerInterestPercent;
    uint public tokensLockPeriod;
    mapping(string=>address) private contracts;
    
    /// private attributes ///

    /// Constructors ///
    constructor (address contextStorage) public WithKimlicContext(contextStorage) {
    }

    /// public methods ///
    function createProvisioningContract(address account, string accountFieldName, string key) 
            public returns(ProvisioningContract createdContract) {
        
        KimlicContractsContext context = getContext();
        uint reward = context.getProvisioningPrice().getPrice(accountFieldName);
        uint dataIndex = context.getAccountStorageAdapter().getFieldHistoryLength(account, accountFieldName);

        createdContract = new ProvisioningContract(_storage, account, accountFieldName, dataIndex, reward);
        createdContract.transferOwnership(msg.sender);
        address createdContractAddress = address(createdContract);
        createdContracts[createdContractAddress] = true;
        contracts[key] = createdContractAddress;

        context.getKimlicToken().transferFrom(msg.sender, createdContractAddress, reward);
    }

    function setInterestsPercent(uint8 communityTokenWallet, uint8 coOwner, uint8 attestationParty, uint8 account) public {
        require((communityTokenWallet + attestationParty + account + coOwner) == 100);

        communityTokenWalletInterestPercent = communityTokenWallet;
        attestationPartyInterestPercent = attestationParty;
        accountInterestPercent = account;
        coOwnerInterestPercent = coOwner;
    }

    function setTokensLockPeriod(uint lockPeriod) public {
        tokensLockPeriod = lockPeriod;
    }

    function getProvisioningContract(string key) view public returns (address) {
        return contracts[key];
    }
}