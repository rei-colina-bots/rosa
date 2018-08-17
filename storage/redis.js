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
    console.log('KEY!!!!');
    console.log(key);
    console.log(JSON.stringify(jsonValue));
    let expiry = secondsToExpire || config.STORAGE_DEFAULT_EXPIRY;
    client.set(key, JSON.stringify(jsonValue), 'EX', expiry, redis.print);
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
