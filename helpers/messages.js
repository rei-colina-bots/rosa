"use strict";

/*
 * MESSAGES
 *
 * Objects and methods that create objects that represent
 * messages sent to the Bot's users.
 */

/*
 * Button that sends a payload back to the server
 */
const buildPostbackButton = function(title, payload) {
    return {
        type: 'postback',
        payload: payload,
        title: title
    };
};

module.exports = {
    buildPostbackButton
}

