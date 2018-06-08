pragma solidity ^0.4.23;


import "./openzeppelin-solidity/StandardToken.sol";

contract KimlicToken is StandardToken {

    /// constructors ///
    constructor () public {
        
        totalSupply_ = 150000000;
        balances[msg.sender] = totalSupply_;
    }

}