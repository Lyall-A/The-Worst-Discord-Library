const constants = require("../constants");

function objToInt(obj) {
    return obj.reduce((prev, curr) => prev + (constants.intents[curr] || 0), 0);
}

function intToObj(int) {
    return Object.entries(constants.intents).filter(([key, value]) => int & value).map(([key]) => key);
}

module.exports = {
    objToInt,
    intToObj
}