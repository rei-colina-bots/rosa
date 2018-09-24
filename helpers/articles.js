"use strict";

/*
 * ARTICLES
 *
 * Objects and methods that create objects that represent
 * articles sent to an user.
 */

const
    hackerNews = require('hackernews-api'),
    config = require("../constants/config.js"),
    oauth = require("./oauth.js"),
    dataStore = require("../data/storage.js"),
    amplify = require("./amplify.js"),
    Parser = require('rss-parser');

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

/*
 * Retrieves articles from Hootsuite Amplify API
 */
const getAmplify = async (psid) => {
    let users = new dataStore('users');
    let articles = [];

    // Retrieve user's data
    let user = users.get(psid);

    // Get a new API token data
    let tokenData = await oauth.refreshToken(
        config.API_HOOTSUITE_BASE_URL,
        user.amplify.refreshToken
    );

    // Save the new token data for this user
    user.amplify.accessToken = tokenData.access_token;
    user.amplify.refreshToken = tokenData.refresh_token;
    users.set(psid, user);

    // Get the Amplify items and return an array of valid articles
    let items = await amplify.getMessages(user.amplify.accessToken);
    let i = 0;
    if (items.length > 0) {
        while (articles.length < config.MAX_ARTICLES) {
            if (items[i].text && items[i].url
                && items[i].isShareable && !items[i].isDeleted
                && items[i].photoUrl) {
                articles.push({
                    title: items[i].text,
                    url: items[i].url,
                    image: items[i].photoUrl
                });
            }
            i = i + 1;
        }
    }
    return articles;
};


module.exports = {
    getTech,
    getFromRssFeed,
    getAmplify
}

