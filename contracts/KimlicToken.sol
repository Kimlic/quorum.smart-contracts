pragma solidity ^0.4.23;


import "./openzeppelin-solidity/StandardToken.sol";

/// @title Contract to define tokens emission
/// @author Bohdan Grytsenko
/// @notice Defines total supply of emitted tokens and allocate them to owner
contract KimlicToken is StandardToken {
    uint public constant decimals = 18; 

    /// constructors ///
    constructor () public {
        
        totalSupply_ = 150000000 ** decimals;
        balances[msg.sender] = totalSupply_;
    }

}