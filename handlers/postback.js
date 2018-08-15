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

/*
 * Returns a response to the GET_STARTED event
 */
const handleGetStarted = () => {
    return messages.text(text.GET_STARTED);
};

/*
 * Returns a response to the TOPIC_TECH event
 */
const handleFeed = (feedType) => {
    let feed = [];
    let cards = [];
    let buttons = [];

    if (feedType === events.TOPIC_TECH) {
        feed = articles.getTech();
    } else if (feedType === events.TOPIC_BBC) {
        articles.getFromRssFeed(config.RSS_BBC).then(items => {
            feed = items;
        });
    } else if (feedType === events.TOPIC_HBR) {
        feed = articles.getFromRssFeed(config.RSS_HBR);
    } else if (feedType === events.TOPIC_WIRED) {
        feed = articles.getFromRssFeed(config.RSS_WIRED);
    }

    feed.forEach((article) => {
        buttons = [
            messages.webURLButton(text.SHARE_ON_FB, utils.getShareLink('fb', article.title, article.url)),
            messages.webURLButton(text.SHARE_ON_TW, utils.getShareLink('tw', article.title, article.url)),
            messages.webURLButton(text.SHARE_ON_LI, utils.getShareLink('li', article.title, article.url))
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

module.exports = {
    handleGetStarted,
    handleFeed,
    handleSocialNetworks
}
