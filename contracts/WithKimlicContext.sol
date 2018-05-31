pragma solidity ^0.4.23;


import "./KimlicContractsContext.sol";

contract WithKimlicContext {
    
    KimlicContractsContext internal _context;

    constructor (KimlicContractsContext context) public {
        _context = context;
    }
}