"use strict";

/*
 * OAUTH
 *
 * Objects and methods to handle OAuth flows.
 */

const request = require('request');

/*
 * Performs token exchange
 */
const getToken = (baseUrl, authCode, redirectUri) => {
    return postRequest(baseUrl, {
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUri
    });
};

const postRequest = (baseUrl, payload) => {
    return new Promise(function (resolve, reject) {
        request({
            uri: baseUrl + '/oauth2/token',
            method: 'POST',
            json: payload
        }, (err, res, body) => {
            console.log(res);
            console.log(body);
            console.log(err);
            if (err) {
                console.error('Unable to send OAuth message:' + err);
                reject(err);
            }
            resolve(body);
        }); 
    });
};

module.exports = {
    getToken
}