
let getValueByPath = (networkConfig, path) => {
    var value = networkConfig;
    let pathParts = path.split(".");
    for (let index = 0; index < pathParts.length; index++) {
        let pathPart = pathParts[index];
        
        value = value[pathPart] || {};
        //console.log(`pathPart: ${pathPart}, value: ${JSON.stringify(value)}`);
    }
    value = Object.keys(value).length > 0 ? value : null;
    //console.log(`value: ${JSON.stringify(value)}`);
    return value;
};

module.exports = { getValueByPath };