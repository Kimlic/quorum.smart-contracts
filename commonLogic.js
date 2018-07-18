
let getValueByPath = (networkConfig, path, defaultValue = {}) => {
    var value = networkConfig;
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

let setValueByPath = (networkConfig, path, data) => {
    var selectedValue = networkConfig;
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

module.exports = { getValueByPath, setValueByPath };