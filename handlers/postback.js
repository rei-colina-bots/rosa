"use strict";

/*
 * POSTBACK
 *
 * Methods that handle postback events.
 */

const messages = require("../helpers/messages.js");
const text = require("../constants/text.js");
const config = require("../constants/config.js");
const events = require("../constants/events.js");
const utils = require("../helpers/utils.js");
const articles = require("../helpers/articles.js");
const storage = require("../storage/redis.js");

/*
 * Returns a response to the GET_STARTED event
 */
const handleGetStarted = () => {
    return messages.text(text.GET_STARTED);
};

/*
 * Returns a response for TOPIC event
 */
const handleFeed = async (feedType) => {
    let feed = [];
    let cards = [];
    let buttons = [];

    if (feedType === events.TOPIC_TECH) {
        feed = await articles.getTech();
    } else if (feedType === events.TOPIC_REUTERS) {
        feed = await articles.getFromRssFeed(config.RSS_REUTERS);
    } else if (feedType === events.TOPIC_ENT_LEAD) {
        feed = await articles.getFromRssFeed(config.RSS_ENT_LEAD);
    }

    feed.forEach((article) => {
        let articleId = 'articles:' + Math.random().toString(36).substr(2, 9);
        storage.set(articleId, {
            title: article.title, url: article.url
        });
        buttons = [
            messages.webURLButton(text.SHARE_ON_FB, utils.getShareLink('fb', article.title, article.url)),
            messages.webURLButton(text.SHARE_ON_TW, utils.getShareLink('tw', article.title, article.url)),
            // messages.webURLButton(text.SHARE_ON_LI, utils.getShareLink('li', article.title, article.url)),
            messages.postbackButton("Share", articleId)
        ];
        cards.push(messages.card(article.title, '', '', article.url, buttons));
    });
    return messages.carousel(cards);
};

/*
 * Returns a response to the SOCIAL_NETWORKS event
 */
const handleSocialNetworks = () => {
    let cards = [];

    cards.push(messages.card(text.FACEBOOK, config.FB_LOGO_URL, '', config.FB, [
        messages.webURLButton(text.SIGN_IN, config.FB),
    ]));
    cards.push(messages.card(text.TWITTER, config.TW_LOGO_URL, '', config.TW, [
        messages.webURLButton(text.SIGN_IN, config.TW),
    ]));
    cards.push(messages.card(text.LINKEDIN, config.LI_LOGO_URL, '', config.LI, [
        messages.webURLButton(text.SIGN_IN, config.LI),
    ]));
    return messages.carousel(cards);
};

/*
 * Returns a response to an article share event
 */
const handleShare = async (articleId) => {
    let article = await storage.get(articleId)
    return messages.text("share: " + article.title);
};

module.exports = {
    handleGetStarted,
    handleFeed,
    handleSocialNetworks,
    handleShare
}
