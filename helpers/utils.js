"use strict";

/*
 * UTILS
 *
 * Utility objects and methods.
 */

/*
 * Generates a social media share link
 */
const getShareLink = (network, title, url) => {
    if (network === 'fb') {
        return 'https://www.facebook.com/sharer/sharer.php?u=' + url;
    } else if (network === 'tw') {
        return 'https://twitter.com/intent/tweet?text=' + title + '%20' + url + '&source=webclient';
    } else if (network === 'li') {
        return 'https://www.linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + title;
    } else {
        return '';
    }
};


module.exports = {
    getShareLink
}

