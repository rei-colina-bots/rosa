"use strict";

/*
 * UTILS
 *
 * Utility objects and methods.
 */

const config = require("../constants/config.js");

/*
 * Generates a social media share link
 */
const getShareLink = (network, title, url) => {
    if (network === 'fb') {
        return config.FB_SHARE_URL + url;
    } else if (network === 'tw') {
        return config.TW_SHARE_URL + title + '%20' + url + '&source=webclient';
    } else if (network === 'li') {
        return config.LI_SHARE_URL + url + '&title=' + title;
    } else if (network === 'gl') {
        return config.GL_SHARE_URL + url
    } else if (network === 'hs') {
        return config.HS_SHARE_URL + title + '%20' + url;
    } else {
        return '';
    }
};

/*
 * Generates a social media share link
 */
const getSaveLink = (url) => {
    return config.POCKET_SAVE_URL + url;
};

/*
 * Generates a oauth authentication link
 */
const getAuthLink = (baseUrl, clientId, redirectUrl,
    scope, state) => {
        return baseUrl + 'oauth2/auth?response_type=code&client_id=' + clientId
            + '&redirect_uri=' + redirectUrl + '&scope=' + scope + '&state=' + state;
};

module.exports = {
    getShareLink,
    getSaveLink,
    getAuthLink
}

