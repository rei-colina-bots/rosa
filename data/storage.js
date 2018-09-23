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
            console.log('SETTING NEW STORAGE FOR ' + name);
            memoryStorage[name] = {};
        }
    }

    get(key) {
        console.log('GETTING ' + key);
        console.log(memoryStorage[this.name]);
        console.log(memoryStorage[this.name][key]);
        return memoryStorage[this.name][key];
    }

    set(key, value) {
        console.log('Setting ' + value + ' for ' + key);
        memoryStorage[this.name][key] = value;
        console.log(memoryStorage[this.name]);
    }

};
