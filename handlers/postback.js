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
const dataStore = require("../data/storage.js");

let users = new dataStore('users');

/*
 * Returns a response to the GET_STARTED event
 */
const handleGetStarted = () => {
    let buttons = [messages.postbackButton(text.WHAT_ELSE,
        events.GET_STARTED_2)];
    return messages.buttonCard(text.GET_STARTED, buttons);
};

/*
 * Returns a response to the GET_STARTED_2 event
 */
const handleGetStarted2 = () => {
    let buttons = [messages.postbackButton(text.WHAT_ELSE,
        events.GET_STARTED_3)];
    return messages.buttonCard(text.GET_STARTED_2, buttons);
};

/*
 * Returns a response to the GET_STARTED_3 event
 */
const handleGetStarted3 = () => {
    let buttons = [
        messages.postbackButton(text.SHOW_ME_NEWS, events.TOPIC_REUTERS),
        messages.postbackButton(text.SEE_SOCIAL_NETWORKS, events.MENU_SOCIAL)
    ];
    return messages.buttonCard(text.GET_STARTED_3, buttons);
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
    } else if (feedType === events.TOPIC_BBC) {
        feed = await articles.getFromRssFeed(config.RSS_BBC);
        image = config.BBC_LOGO_URL;
    } else if (feedType === events.TOPIC_COIN_TELEGRAPH) {
        feed = await articles.getFromRssFeed(config.RSS_COIN_TELEGRAPH);
        image = config.COIN_TELEGRAPH_LOGO_URL;
    }

    feed.forEach((article) => {
        buttons = [
            messages.webURLButton(text.VIEW, article.url),
            messages.webURLButton(text.SAVE_FOR_LATER,
                utils.getSaveLink(article.url)),
            messages.postbackButton(text.SHARE, JSON.stringify(article))
        ];
        cards.push(messages.card(article.title, image, '', '', buttons));
    });
    return messages.carousel(cards);
};

/*
 * Returns a response to the SAVED_ITEMS event
 */
const handleSavedArticles = () => {
    let cards = [];
    let buttons = [
        messages.webURLButton(text.GO_TO_POCKET_BUTTON, config.POCKET_URL),
    ];
    cards.push(messages.card(text.GO_TO_POCKET_TITLE, config.POCKET_LOGO_URL,
        '', '', buttons));
    return messages.carousel(cards);
};

/*
 * Returns a response to the PAID_SERVICES event
 */
const handlePaidServices = (sender_psid) => {
    let cards = [];
    let hootsuite_auth_url = utils.getAuthLink(config.API_AMPLIFY_BASE_URL,
        process.env.HOOTSUITE_CLIENT_ID, config.API_AMPLIFY_AUTH_REDIRECT_URL,
        'offline', sender_psid);
    
    let amplify_button = messages.loginButton(hootsuite_auth_url);
    if (users.get(sender_psid) && users.get(sender_psid).amplifyToken) {
        amplify_button = messages.webURLButton(text.GO_TO_AMPLIFY_BUTTON, "https://www.hootsuite.com");
    }

    let buttons = [
        amplify_button,
    ];

    cards.push(messages.card(text.GO_TO_AMPLIFY_TITLE, config.AMPLIFY_LOGO_URL,
        text.GO_TO_AMPLIFY_SUBTITLE, '', buttons));
    return messages.carousel(cards);
};

/*
 * Returns a response to the SOCIAL_NETWORKS event
 */
const handleSocialNetworks = () => {
    let cards = [];

    cards.push(messages.card(text.FACEBOOK, config.FB_LOGO_URL, '', '', [
        messages.webURLButton(text.SIGN_IN, config.FB),
    ]));
    cards.push(messages.card(text.TWITTER, config.TW_LOGO_URL, '', '', [
        messages.webURLButton(text.SIGN_IN, config.TW),
    ]));
    cards.push(messages.card(text.LINKEDIN, config.LI_LOGO_URL, '', '', [
        messages.webURLButton(text.SIGN_IN, config.LI),
    ]));
    cards.push(messages.card(text.INSTAGRAM, config.IG_LOGO_URL, '', '', [
        messages.webURLButton(text.SIGN_IN, config.IG),
    ]));
    cards.push(messages.card(text.GOOGLEPLUS, config.GL_LOGO_URL, '', '', [
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
    cards.push(messages.card(article.title, config.FB_LOGO_URL, '', '', [
        messages.webURLButton(text.SHARE_ON_FB, shareLink),
    ]));
    shareLink = utils.getShareLink('tw', article.title, article.url);
    cards.push(messages.card(article.title, config.TW_LOGO_URL, '', '', [
        messages.webURLButton(text.SHARE_ON_TW, shareLink),
    ]));
    shareLink = utils.getShareLink('li', article.title, article.url);
    cards.push(messages.card(article.title, config.LI_LOGO_URL, '', '', [
        messages.webURLButton(text.SHARE_ON_LI, shareLink),
    ]));
    shareLink = utils.getShareLink('gl', article.title, article.url);
    cards.push(messages.card(article.title, config.GL_LOGO_URL, '', '', [
        messages.webURLButton(text.SHARE_ON_GL, shareLink),
    ]));
    shareLink = utils.getShareLink('hs', article.title, article.url);
    cards.push(messages.card(article.title, config.HS_LOGO_URL, '', '', [
        messages.webURLButton(text.SHARE_ON_HS, shareLink),
    ]));
    return messages.carousel(cards);
};

module.exports = {
    handleGetStarted,
    handleGetStarted2,
    handleGetStarted3,
    handleFeed,
    handleSocialNetworks,
    handleShare,
    handleSavedArticles,
    handlePaidServices
}
