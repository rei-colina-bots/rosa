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

/*
 * Performs token refresh
 */
const refreshToken = (baseUrl, refreshToken) => {
    return postRequest(baseUrl, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    });
};

const postRequest = (baseUrl, payload) => {
    return new Promise(function (resolve, reject) {
        let auth = "Basic " + new Buffer(
            encodeURIComponent(process.env.HOOTSUITE_CLIENT_ID)
            + ":" + encodeURIComponent(process.env.HOOTSUITE_CLIENT_SECRET)
        ).toString("base64");
        console.log(baseUrl);
        console.log("PAYLOAD!!!!");
        console.log(payload);
        request({
            uri: baseUrl + 'oauth2/token',
            method: 'POST',
            headers : {
                "Authorization" : auth
            },
            form: payload
        }, (err, res, body) => {
            if (err) {
                console.error('Unable to send OAuth message:' + err);
                reject(err);
            }
            console.log('BODY!!!!!!!!!!!');
            console.log(body);
            resolve(JSON.parse(body));
        }); 
    });
};

module.exports = {
    getToken,
    refreshToken
}