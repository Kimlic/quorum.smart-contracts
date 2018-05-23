pragma solidity 0.4.24;


import "./Ownable.sol";
import "./EmailVerification.sol";

contract VerificationContractFactory {
    address private verifier;
    uint private rewardAmount;

    constructor() public {
        verifier = address(0);
        rewardAmount = 1;
    }

    function createEmailVerification(bytes32 account, bytes32 emailHash)
            public returns(address createdContract) {
        createdContract = new EmailVerification(account, emailHash,
            verifier, rewardAmount);
    }
}
