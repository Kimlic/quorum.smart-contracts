var { getMainAccount } = require("../../configReader");

let unlockAccount = (deployer, address, password) => {

    var unlockAccountRequest = {
        "jsonrpc": "2.0",
        "method": "personal_unlockAccount",
        "params": [address, password],
        "id": 1
    };
    console.log("send unlock request " + JSON.stringify(unlockAccountRequest));
    var response = deployer.provider.send(unlockAccountRequest);
    console.log("response: " + JSON.stringify(response));
};

let getDeployConfig = (deployer, network, accounts) => {
    
    let mainAccount = getMainAccount(network);
    if (mainAccount.address) {
        unlockAccount(deployer, mainAccount.address, mainAccount.password);
    } else {
        mainAccount = { address: accounts[0] };
        console.log("Main account address in config.json account not found for this network.\n" +
            "Using default truffle account address.");
    }
    console.log(`Main account address: ${mainAccount.address}`);

    return  {
        "from": mainAccount.address
    };
};

let getFormatedConsoleLable = function(unformatedLable){
    var separationString = "=".repeat(10);
    return "\n" + separationString + " " + unformatedLable + " " + separationString + "\n";
};

let accountFields = [
    "identity",//TODO probably we dont need this field anymore
    "email",
    "phone",
    "documents.id_card",
    "documents.passport",
    "documents.driver_license",
    "documents.residence_permit_card",
    "addresses.billing",
    "addresses.living",
    "device"
]

let emptyAddress = "0x0000000000000000000000000000000000000000"
module.exports = { unlockAccount, getDeployConfig, getFormatedConsoleLable, emptyAddress, accountFields };