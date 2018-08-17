"use strict";

/*
 * REDIS
 *
 * Objects and methods to make calls to the Redis API.
 */

const redis = require('redis')
const client = redis.createClient(process.env.REDIS_URL);
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
const get = async (key) => {
    client.get(key, function (err, reply) {
        console.log('RESPONSE!!!!');
        console.log(reply);
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
