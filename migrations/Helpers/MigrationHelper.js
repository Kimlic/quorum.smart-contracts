const { getMainAccount } = require("../../configReader");

const unlockAccount = (deployer, address, password) => {

    const unlockAccountRequest = {
        "jsonrpc": "2.0",
        "method": "personal_unlockAccount",
        "params": [address, password, 1000],
        "id": 1
    };
    console.log("send unlock request " + JSON.stringify(unlockAccountRequest));
    const response = deployer.provider.send(unlockAccountRequest);
    console.log("response: " + JSON.stringify(response));
};

const getTransactionConfig = (deployer, network, accounts) => {
    
    let mainAccount = getMainAccount(network);
    if (!mainAccount.address) {
        mainAccount = { address: accounts[0], password: "" };
        console.log("Main account address in config.json account not found for this network.\n" +
            "Using default truffle account address.");
    }
    unlockAccount(deployer, mainAccount.address, mainAccount.password);
    console.log(`Main account address: ${mainAccount.address}\n`);

    return  {
        "from": mainAccount.address
    };
};

const separationString = "=".repeat(10);
const getFormatedConsoleLabel = function(unformatedLable){
    return "\n" + separationString + " " + unformatedLable + " " + separationString + "\n";
};

module.exports = { unlockAccount, getTransactionConfig, getFormatedConsoleLabel };