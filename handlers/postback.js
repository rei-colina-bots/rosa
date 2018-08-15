"use strict";

/*
 * POSTBACK
 *
 * Methods that handle postback events.
 */

const messages = require("../helpers/messages.js");
const text = require("../constants/text.js");
const config = require("../constants/config.js");
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
const handleTechTopic = () => {
    let techArticles = articles.getTech();
    let cards = [];
    let buttons = [];
    techArticles.forEach((article) => {
        buttons = [
            messages.webURLButton(text.SHARE_ON_FB, utils.getShareLink('fb', article.title, article.url)),
            messages.webURLButton(text.SHARE_ON_TW, utils.getShareLink('tw', article.title, article.url)),
            messages.postbackButton('Share', {
                event: 'share',
                title: article.title,
                url: article.url
            })
            // messages.webURLButton(text.SHARE_ON_LI, utils.getShareLink('li', article.title, article.url))
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

const handleShare = () => {
    replies = [
        messages.quickReply('Facebook', '-', ''),
        messages.quickReply('Twitter', '-', ''),
        messages.quickReply('LinkedIn', '-', ''),
    ];
    return messages.quickReplies('Which social network would you like to share to?', replies);
};

module.exports = {
    handleGetStarted,
    handleTechTopic,
    handleSocialNetworks,
    handleShare
}
