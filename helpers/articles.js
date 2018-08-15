"use strict";

/*
 * ARTICLES
 *
 * Objects and methods that create objects that represent
 * articles sent to an user.
 */

const hackerNews = require('hackernews-api');
const config = require("../constants/config.js");

/*
 * Retrieves techology related articles
 */
const getTech = () => {
    let articles = [];
    let ids = hackerNews.getTopStories();
    let i = 0
    while (articles.length < config.MAX_ARTICLES) {
        var article = hackerNews.getItem(ids[i]);
        if (article.title && article.url) {
            articles.push({
                title: article.title,
                url: article.url
            });
        }
        i = i + 1;
    }
    return articles;
};


module.exports = {
    getTech
}

