pragma solidity ^0.4.23;

/// @title Migrations deployment tracking
/// @author Bohdan Grytsenko
/// @notice Used during deployment track history of applied migrations
contract Migrations {
    address public owner;
    uint public last_completed_migration;

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    /// @notice sets number of last completed migration
    /// @param completed last completed migration number
    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    /// @notice upgrades contract at specific address and tracks migration number applied
    /// @param new_address upgraded contract new address
    function upgrade(address new_address) public restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}
