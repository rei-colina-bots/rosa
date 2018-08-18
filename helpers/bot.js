"use strict";

/*
 * BOT
 *
 * Utility objects and methods specific to bot setup.
 */

const text = require("../constants/text.js");
const events = require("../constants/events.js");
const messages = require('./messages.js');
const api = require('./api.js');

/*
 * Sets up the bot
 */
const setup = (res) => {
    let request_body = {
        get_started: {
            payload: events.GET_STARTED
        },
        persistent_menu:[
            {
              locale: 'default',
              composer_input_disabled: true,
              call_to_actions:[
                {
                  title: text.MENU,
                  type: 'nested',
                  call_to_actions:[
                    {
                        title: text.MENU_TOPICS,
                        type: 'nested',
                        call_to_actions: [
                            messages.postbackButton(text.MENU_TECH,
                                events.TOPIC_TECH),
                            messages.postbackButton(text.MENU_ENT_LEAD,
                                events.TOPIC_ENT_LEAD),
                            messages.postbackButton(text.MENU_REUTERS,
                                events.TOPIC_REUTERS)
                        ]
                    },
                    messages.postbackButton(text.MENU_SOCIAL,
                        events.MENU_SOCIAL),
                    messages.postbackButton(text.MENU_BOOKMARKS,
                        events.MENU_BOOKMARKS),
                  ]
                }
              ]
            }
          ]
    };
    api.callSendAPI(request_body, 'messenger_profile');
    res.status(200).send('SETUP_COMPLETED');
};

module.exports = {
    setup
}
