pragma solidity ^0.4.23;


import "./Ownable.sol";
import "./StandardToken.sol";

contract KimlicToken is StandardToken, Ownable {

    /// constructors ///
    constructor () public Ownable() {
        
        totalSupply_ = 150000000;
        balances[owner] = totalSupply_;
    }

}