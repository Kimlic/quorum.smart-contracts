pragma solidity ^0.4.23;

import "./KimlicContractsContext.sol";
import "./ProvisioningContract.sol";

contract ProvisioningContractFactory {
    /// public attributes ///
    mapping(address=>bool) public createdContracts;
    uint8 public communityTokenWalletInterestPercent;
    uint8 public attestationPartyInterestPercent;
    uint8 public accountInterestPercent;
    uint8 public coOwnerInterestPercent;
    
    /// private attributes ///
    KimlicContractsContext private _context;

    /// Constructors ///
    constructor (KimlicContractsContext context) public {
        _context = context;
    }

    /// public methods ///
    function createProvisioningContract(address account) public returns(ProvisioningContract createdContract) {
        createdContract = new ProvisioningContract(_context, account);
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