"use strict";

/*
 * ARTICLES
 *
 * Objects and methods that create objects that represent
 * articles sent to an user.
 */

const hackerNews = require('hackernews-api');

/*
 * Retrieves techology related articles
 */
const getTech = () => {
    let articles = [];
    let ids = hackerNews.getTopStories();
    let i = 0
    for (i = 0; i < 3; i++) { 
        var article = hackerNews.getItem(ids[i]);
        articles.push({
            title: article.title,
            url: article.url
        });
    }
    return articles;
};


module.exports = {
    getTech
}

