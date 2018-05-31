pragma solidity ^0.4.23;

import "./WithKimlicContext.sol";
import "./ProvisioningContract.sol";

contract ProvisioningContractFactory is WithKimlicContext {
    mapping(address=>bool) createdContracts;
    
    constructor (KimlicContractsContext context) public WithKimlicContext(context) {
        
    }

    function createProvisioningContract(address account) public returns(ProvisioningContract createdContract) {
        createdContract = new ProvisioningContract(_context, account);
        createdContract.transferOwnership(msg.sender);
        createdContracts[address(createdContract)] = true;
    }
}