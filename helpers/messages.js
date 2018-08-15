"use strict";

/*
 * MESSAGES
 *
 * Objects and methods that create objects that represent
 * messages sent to the Bot's users.
 */

/*
 * Button that sends a payload back to the server
 */
const postbackButton = (title, payload) =>{
    return {
        type: 'postback',
        payload: payload,
        title: title
    };
};

/*
 * Button that links to a web URL
 */
const webURLButton = (title, url) => {
    return {
        type: 'web_url',
        url: url,
        title: title
    };
};

/*
 * Message that represents a card
 */
const card = (title, image_url, subtitle, url, buttons) => {
    return {
        title: title,
        image_url: image_url,
        subtitle: subtitle,
        default_action: {
            type: 'web_url',
            url: url,
            webview_height_ratio: 'tall',
        },
        buttons: buttons
    }
};

/*
 * Message that represents a carousel of cards
 */
const carousel = (cards) => {
    return {
        attachment:{
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: cards
          }
        }
    }
};

/*
 * Message with basic text
 */
const text = (message) => {
    return {
        text: message
    }
};

/*
 * Quick reply button
 */
const quickReply = (title, payload, image_url) => {
    return {
        content_type: 'text',
        title: title,
        payload: payload,
        image_url: image_url
    }
};

/*
 * Message with quick replies
 */
const quickReplies = (message, replies) => {
    return {
        text: message,
        quick_replies: replies
    }
};

module.exports = {
    postbackButton,
    webURLButton,
    card,
    carousel,
    text,
    quickReply,
    quickReplies
}

