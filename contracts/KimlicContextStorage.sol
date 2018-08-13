pragma solidity ^0.4.23;


import "./openzeppelin-solidity/Ownable.sol";
import "./KimlicContractsContext.sol";
import "./BaseStorage.sol";

/// @title Root contract
/// @author Bohdan Grytsenko
/// @notice Manages address of KimlicContractsContext during deployment, returns it during runtime to any platform member
contract KimlicContextStorage is BaseStorage, Ownable {

    /// constructors ///

    /// @notice executed during deployment to set address of KimlicContractsContext contract if it was changed and re-deployed
    /// @param context address of re-deployed KimlicContractsContext contract
    function setContext(address context) public onlyOwner() {
        addressStorage[getContextKey()] = context;
    }

    /// @notice returns current address of KimlicContractsContext contract
    /// @return context current address of KimlicContractsContext contract
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