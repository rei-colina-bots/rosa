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
    let buttons = [messages.postbackButton(text.WHAT_ELSE, events.GET_STARTED_2)];
    return messages.buttonCard(text.GET_STARTED, buttons);
};

/*
 * Returns a response to the GET_STARTED_2 event
 */
const handleGetStarted2 = () => {
    return messages.text(text.GET_STARTED_2);
};

/*
 * Returns a response to the TOPIC_TECH event
 */
const handleFeed = async (feedType) => {
    let feed = [];
    let cards = [];
    let buttons = [];
    let image = ''

    if (feedType === events.TOPIC_TECH) {
        feed = await articles.getTech();
        image = config.HN_LOGO_URL;
    } else if (feedType === events.TOPIC_REUTERS) {
        feed = await articles.getFromRssFeed(config.RSS_REUTERS);
        image = config.REUTERS_LOGO_URL;
    } else if (feedType === events.TOPIC_ENT_LEAD) {
        feed = await articles.getFromRssFeed(config.RSS_ENT_LEAD);
        image = config.ENT_LOGO_URL;
    }

    feed.forEach((article) => {
        buttons = [
            messages.postbackButton(text.SHARE, JSON.stringify(article))
        ];
        cards.push(messages.card(article.title, image, '', article.url, buttons));
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
    cards.push(messages.card(text.INSTAGRAM, config.IG_LOGO_URL, '', config.IG, [
        messages.webURLButton(text.SIGN_IN, config.IG),
    ]));
    cards.push(messages.card(text.GOOGLEPLUS, config.GL_LOGO_URL, '', config.GL, [
        messages.webURLButton(text.SIGN_IN, config.GL),
    ]));
    return messages.carousel(cards);
};

/*
 * Returns a response to the SHARE event
 */
const handleShare = (article) => {
    let cards = [];
    let shareLink = '';

    shareLink = utils.getShareLink('fb', article.title, article.url);
    cards.push(messages.card(article.title, config.FB_LOGO_URL, '', shareLink, [
        messages.webURLButton(text.SHARE_ON_FB, shareLink),
    ]));
    shareLink = utils.getShareLink('tw', article.title, article.url);
    cards.push(messages.card(article.title, config.TW_LOGO_URL, '', shareLink, [
        messages.webURLButton(text.SHARE_ON_TW, shareLink),
    ]));
    shareLink = utils.getShareLink('li', article.title, article.url);
    cards.push(messages.card(article.title, config.LI_LOGO_URL, '', shareLink, [
        messages.webURLButton(text.SHARE_ON_LI, shareLink),
    ]));
    shareLink = utils.getShareLink('gl', article.title, article.url);
    cards.push(messages.card(article.title, config.GL_LOGO_URL, '', shareLink, [
        messages.webURLButton(text.SHARE_ON_GL, shareLink),
    ]));
    shareLink = utils.getShareLink('hs', article.title, article.url);
    cards.push(messages.card(article.title, config.HS_LOGO_URL, '', shareLink, [
        messages.webURLButton(text.SHARE_ON_HS, shareLink),
    ]));
    return messages.carousel(cards);
};

module.exports = {
    handleGetStarted,
    handleGetStarted2,
    handleFeed,
    handleSocialNetworks,
    handleShare
}
