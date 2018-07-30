
let getValueByPath = (object, path, defaultValue = {}) => {
    var value = object;
    let pathParts = path.split(".");
    for (let index = 0; index < pathParts.length -1; index++) {
        let pathPart = pathParts[index];
        
        if (!value[pathPart]) {
            value[pathPart] = {};
        }
        value = value[pathPart];
    }

    const lastPathPart = pathParts.pop();
    if (!value[lastPathPart]) {
        value[lastPathPart] = defaultValue;
    }
    return value[lastPathPart];
};

let setValueByPath = (object, path, data) => {
    var selectedValue = object;
    let pathParts = path.split(".");
    for (let index = 0; index < pathParts.length - 1; index++) {
        let pathPart = pathParts[index];
        
        if (!selectedValue[pathPart]) {
            selectedValue[pathPart] = {};
        }
        selectedValue = selectedValue[pathPart];
    }
    const lastPathPart = pathParts.pop();
    selectedValue[lastPathPart] = data;
};

const combinePath = (pathTemplate, config) => {
    Object.keys(config).forEach(key => {
        var regExp = new RegExp(`{${key}}`,"g");
        pathTemplate = pathTemplate.replace(regExp, config[key]);
    });
    return pathTemplate;
};


let uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const emptyAddress = "0x0000000000000000000000000000000000000000";

const separationString = "=".repeat(10);
const getFormatedConsoleLabel = function(unformatedLable){
    return "\n" + separationString + " " + unformatedLable + " " + separationString + "\n";
};

const createAccountAndSet1EthToBalance = async (web3, accountPassword = "p@ssw0rd") => {
    const accountAddress = await web3.personal.newAccount(accountPassword);
    await web3.personal.unlockAccount(accountAddress, accountPassword, 1000);
    await web3.eth.sendTransaction({"from": web3.eth.coinbase, "to": accountAddress, "value": 1000000000000000000});//1 eth
    return { accountAddress, accountPassword };
}
module.exports = { getValueByPath, setValueByPath, emptyAddress, combinePath, uuidv4, getFormatedConsoleLabel, createAccountAndSet1EthToBalance };