var fs = require("fs");

var getMainAccount = function(network) {

    var config = JSON.parse(fs.readFileSync('config.json'));
    var mainAccount = config && config[network] && config[network].addresses
        && config[network].addresses.mainAccount || {};

    return mainAccount;
};

module.exports = { getMainAccount };