pragma solidity ^0.4.23;

import "./openzeppelin-solidity/Ownable.sol";
import "./AccountStorageAdapter.sol";

contract ProvisioningPrice is Ownable {

    /// private attributes ///
    mapping (string=>uint) private _priceMap;

    /// public methods ///
    function setPrice(string accountFieldName, uint price) public onlyOwner() {
        _priceMap[accountFieldName] = price;
    }

    function getPrice(string accountFieldName) public view returns (uint price) {
        price = _priceMap[accountFieldName];
    }
}