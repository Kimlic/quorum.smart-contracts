pragma solidity ^0.4.23;


import "./WithKimlicContext.sol";
import "./KimlicContractsContext.sol";

contract ProvisioningContract is WithKimlicContext {

    
    constructor (KimlicContractsContext context, address relyingParty, address account) public WithKimlicContext(context) {
    }
}