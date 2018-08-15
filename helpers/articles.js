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

/*
 * Retrieves articles from a given RSS feed
 */
const getFromRssFeed = async (rssUrl) => {
    let articles = [];
    let parser = new Parser();
    let feed = await parser.parseURL(rssUrl);
    let i = 0;
    if (feed.items.length > 0) {
        while (articles.length < config.MAX_ARTICLES) {
            if (feed.items[i].title && feed.items[i].link) {
                articles.push({
                    title: feed.items[i].title,
                    url: feed.items[i].link
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

