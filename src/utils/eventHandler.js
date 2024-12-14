function call(event, ...args) {
    for (let listenerIndex = this._listeners.length - 1; listenerIndex >= 0; listenerIndex--) {
        const listener = this._listeners[listenerIndex];
        if (listener.event.toLowerCase() !== event.toLowerCase()) continue;
        listener.callback(...args);
        if (listener.once) this._listeners.splice(listenerIndex, 1);
    }
}

function on(event, callback) {
    this._listeners.push({ event, callback, once: false });
}

function once(event, callback) {
    this._listeners.push({ event, callback, once: true });
}

const addListener = on;

function removeListener(event, callback) {
    const listenerIndex = this._listeners.findIndex(i => i.event === event && i.callback === callback);
    if (listenerIndex < 0) return false;
    this._listeners.splice(listenerIndex, 1);
    return true;
}

module.exports = {
    call,
    on,
    once,
    addListener,
    removeListener
};