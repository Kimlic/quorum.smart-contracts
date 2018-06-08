pragma solidity ^0.4.23;


import "./KimlicContractsContext.sol";
import "./KimlicContextStorage.sol";

contract WithKimlicContext {
    KimlicContextStorage internal _storage;

    constructor(address contextStorage) public {
        _storage = KimlicContextStorage(contextStorage);
    }

    function getContext() internal view returns(KimlicContractsContext context) {
        context = _storage.getContext();
    }
}