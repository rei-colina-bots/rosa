"use strict";

/*
 * POSTBACK
 *
 * Methods that handle postback events.
 */

const messages = require("../helpers/messages.js");
const text = require("../constants/text.js");
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
    let i;
    let techArticles = articles.getTech();
    let cards = [];
    let buttons = [];
    techArticles.forEach((article) => {
        buttons = [
            messages.webURLButton(text.SHARE_ON_FB, utils.getShareLink('fb', article.title, article.url)),
            messages.webURLButton(text.SHARE_ON_TW, utils.getShareLink('tw', article.title, article.url)),
            messages.webURLButton(text.SHARE_ON_LI, utils.getShareLink('li', article.title, article.url))
        ];
        cards.push(messages.card(article.title, '', '', article.url, buttons));
    });
    return messages.carousel(cards);
};

module.exports = {
    handleGetStarted,
    handleTechTopic
}
