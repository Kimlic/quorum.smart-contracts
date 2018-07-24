
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

module.exports = { getValueByPath, setValueByPath, emptyAddress, combinePath, uuidv4 };