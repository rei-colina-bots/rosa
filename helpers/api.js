"use strict";

/*
 * API
 *
 * Objects and methods to make calls to the Bot API.
 */

const request = require('request');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

/*
 * Sends message to the bot
 */
const sendMessage = (sender_psid, message) => {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid
        },
        message: message
    }
    sendAction(sender_psid, 'typing_off');
    callSendAPI(request_body);
};

/*
 * Sends an action to the bot
 */
const sendAction = (sender_psid, action) => {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid
        },
        sender_action: action
    }
    callSendAPI(request_body);
};

/*
 * Sends response messages via the Send API
 */
const callSendAPI = (request_body, endpoint) => {
    // Send the HTTP request to the Messenger Platform
    request({
        uri: 'https://graph.facebook.com/v2.6/me/' + (endpoint || 'messages'),
        qs: { 'access_token': PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
            console.log(body);
        } else {
            console.error('Unable to send message:' + err);
        }
    }); 
};


module.exports = {
    sendMessage,
    sendAction,
    callSendAPI
}

