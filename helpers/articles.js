"use strict";

/*
 * ARTICLES
 *
 * Objects and methods that create objects that represent
 * articles sent to an user.
 */

const hackerNews = require('hackernews-api');
const config = require("../constants/config.js");
const Parser = require('rss-parser');

/*
 * Retrieves techology related articles
 */
const getTech = () => {
    let articles = [];
    let ids = hackerNews.getTopStories();
    let i = 0;
    if (ids.length > 0) {
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
    }
    return articles;
};

const getFromRssFeed = async (rssUrl) => {
    let articles = [];
    let parser = new Parser();
    let feed = await parser.parseURL(rssUrl);
    console.log('FEED!!!!!!');
    console.log(feed);
    let i = 0;
    if (feed.length > 0) {
        while (articles.length < config.MAX_ARTICLES) {
            if (feed[i].title && feed[i].link) {
                articles.push({
                    title: feed[i].title,
                    url: feed[i].link
                });
            }
            i = i + 1;
        }
    }
    return articles;
};


module.exports = {
    getTech,
    getFromRssFeed
}

