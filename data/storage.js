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

    get value(key) {
      return memoryStorage[this.name][key];
    }

    set value(key, data) {
        memoryStorage[this.name][key] = data;
    }
};
