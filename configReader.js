var fs = require("fs");

var getMainAccount = function() {

    var config = JSON.parse(fs.readFileSync('config.json'));
    var mainAccount = config && config.addresses && config.addresses.mainAccount || {};

    return mainAccount;
};

module.exports = { getMainAccount };