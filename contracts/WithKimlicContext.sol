pragma solidity ^0.4.23;


import "./KimlicContractsContext.sol";
import "./KimlicContextStorage.sol";

contract WithKimlicContext {
    /// internal attributes ///
    KimlicContextStorage internal _storage;

    /// constructors ///
    constructor(address contextStorage) public {
        _storage = KimlicContextStorage(contextStorage);
    }

    /// internal methods ///
    function getContext() internal view returns(KimlicContractsContext context) {
        context = _storage.getContext();
    }
}