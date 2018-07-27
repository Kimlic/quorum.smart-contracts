pragma solidity ^0.4.23;


import "./openzeppelin-solidity/StandardToken.sol";

contract KimlicToken is StandardToken {
    uint public constant decimals = 18; 

    /// constructors ///
    constructor () public {
        
        totalSupply_ = 150000000 ** decimals;
        balances[msg.sender] = totalSupply_;
    }

}