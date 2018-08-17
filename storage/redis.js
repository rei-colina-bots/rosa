"use strict";

/*
 * REDIS
 *
 * Objects and methods to make calls to the Redis API.
 */

const client = require('redis').createClient(process.env.REDIS_URL);
const config = require('../constants/config.js');

client.on("error", function (err) {
    console.log("Storage Error " + err);
});

/*
 * Set value
 */
const set = (key, jsonValue, secondsToExpire) => {
    let expiry = secondsToExpire || config.STORAGE_DEFAULT_EXPIRY;
    client.set(key, JSON.stringify(jsonValue), 'EX', expiry);
};

/*
 * Get value
 */
const get = (key) => {
    client.get(key, function (err, reply) {
        if (err) {
            return "";
        }
        return JSON.parse(reply.toString());
    });
};

module.exports = {
    set,
    get
}
