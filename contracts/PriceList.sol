pragma solidity ^0.4.23;

import "./openzeppelin-solidity/Ownable.sol";
import "./AccountStorageAdapter.sol";

/// @title Price list contract
/// @author Bohdan Grytsenko
/// @notice manages price for data attribute verification & consumption
contract PriceList is Ownable {

    /// private attributes ///
    mapping (string=>uint) private _priceMap;

    /// @notice sets price for specific data attribute
    /// @param accountFieldName attribute code
    /// @param price price in tokens
    function setPrice(string accountFieldName, uint price) public onlyOwner() {
        _priceMap[accountFieldName] = price;
    }

    /// @notice returns price for specific data attribute
    /// @param accountFieldName attribute code
    /// @param price price in tokens
    function getPrice(string accountFieldName) public view returns (uint price) {
        price = _priceMap[accountFieldName];
    }
}