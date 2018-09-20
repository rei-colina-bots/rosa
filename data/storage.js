"use strict";

/*
* MEMORY
*
* Class to use data storage.
*/

global.memoryStorage = {};

module.exports = class Storage {
    constructor(name) {
        this.name = name;
        if (!memoryStorage[name]) {
            memoryStorage[name] = {};
        }
    }

    get(key) {
        return memoryStorage[this.name][key];
    }

    set(key, value) {
        memoryStorage[this.name][key] = value;
    }

};
