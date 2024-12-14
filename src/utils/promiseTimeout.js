const constants = require("../constants");

function promiseTimeout(reject, message = "Timed out", timeoutDuration = constants.timeout) {
    const timeout = setTimeout(() => reject(message), timeoutDuration);
    return () => clearTimeout(timeout);
}

module.exports = promiseTimeout;