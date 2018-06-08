pragma solidity ^0.4.23;


import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./BaseStorage.sol";

contract KimlicContextStorage is BaseStorage, Ownable {

    /// constructors ///

    /// public methods ///
    function setContext(address context) public onlyOwner() {
        addressStorage[getContextKey()] = context;
    }

    function getContext() public view returns (KimlicContractsContext context) {
        context = KimlicContractsContext(addressStorage[getContextKey()]);
    }

    /// private methods ///
    function getContextKey() private pure returns(bytes32 key) {
        key = keccak256("kimlicContext");
    }

    /// modifiers ///
    modifier accessRestriction() {
        require(msg.sender == addressStorage[getContextKey()] || msg.sender == owner);
        _;
    }

}