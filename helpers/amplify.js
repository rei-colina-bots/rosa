"use strict";

/*
 * Amplify
 *
 * Objects and methods to handle Hootsuite Amplify API calls.
 */

const
    request = require('request'),
    config = require("../constants/config.js");

/*
 * Gets Articles from Hootsuite Amplify
 */
const getMessages = (token) => {
    return getRequest('amplify/v1/me/messages', token);
};

const getRequest = (endpoint, token) => {
    return new Promise(function (resolve, reject) {
        request({
            uri: config.API_HOOTSUITE_BASE_URL + 'amplify/v1/me/messages',
            method: 'GET',
            headers : {
                "Authorization" : "Bearer " + token
            }
        }, (err, res, body) => {
            if (err) {
                console.error('Unable to send message to Amplify:' + err);
                reject(err);
            }
            resolve(JSON.parse(body).data);
        }); 
    });
};

module.exports = {
    getMessages
}