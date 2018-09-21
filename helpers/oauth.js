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
    postRequest(baseUrl, {
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUri
    });
};

const postRequest = (baseUrl, payload) => {
    request({
        uri: baseUrl + '/oauth2/token',
        method: 'POST',
        json: payload
    }, (err, res, body) => {
        if (err) {
            console.error('Unable to send OAuth message:' + err);
        }
        return body;
    }); 
};

module.exports = {
    getToken
}