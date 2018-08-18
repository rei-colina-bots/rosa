"use strict";

/*
 * UTILS
 *
 * Utility objects and methods.
 */

const config = require("../constants/config.js");
const text = require("../constants/text.js");

/*
 * Generates a social media share link
 */
const getShareLink = (network, title, url) => {
    if (network === text.FACEBOOK) {
        return config.FB_SHARE_URL + url;
    } else if (network === text.TWITTER) {
        return config.TW_SHARE_URL + title + '%20' + url + '&source=webclient';
    } else if (network === text.LINKEDIN) {
        return config.LI_SHARE_URL + url + '&title=' + title;
    } else {
        return '';
    }
};

/*
* Generates a unique ID
*/
const generateId = (type) => {
    return type + Math.random().toString(36).substr(2, 9);
};


module.exports = {
    getShareLink,
    generateId
}

