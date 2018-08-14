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
    for (i = 0; i < 3; i++) {
        buttons = [
            messages.webURLButton(text.SHARE_ON_FB, utils.getShareLink('fb', techArticles[i].title, techArticles[i].url)),
            messages.webURLButton(text.SHARE_ON_TW, utils.getShareLink('tw', techArticles[i].title, techArticles[i].url)),
            messages.webURLButton(text.SHARE_ON_LI, utils.getShareLink('li', techArticles[i].title, techArticles[i].url))
        ];
        cards.push(messages.card(techArticles[i].title, '', '', techArticles[i].url, buttons));
    }
    return messages.carousel(cards);
};

module.exports = {
    handleGetStarted,
    handleTechTopic
}
