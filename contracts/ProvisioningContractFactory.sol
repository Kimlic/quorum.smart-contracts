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
    
    /// private attributes ///

    /// Constructors ///
    constructor (address contextStorage) public WithKimlicContext(contextStorage) {
    }

    /// public methods ///
    function createProvisioningContract(address account) public returns(ProvisioningContract createdContract) {
        createdContract = new ProvisioningContract(_storage, account);
        createdContract.transferOwnership(msg.sender);
        createdContracts[address(createdContract)] = true;
    }

    function setInterestsPercent(uint8 communityTokenWallet, uint8 coOwner, uint8 attestationParty, uint8 account) public {
        require((communityTokenWallet + attestationParty + account + coOwner) == 100);

        communityTokenWalletInterestPercent = communityTokenWallet;
        attestationPartyInterestPercent = attestationParty;
        accountInterestPercent = account;
        coOwnerInterestPercent = coOwner;
    }
}