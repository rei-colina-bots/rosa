"use strict";

/*
 * BOT
 *
 * Utility objects and methods specific to bot setup.
 */

const messages = require('./messages');

/*
 * Sets up the bot
 */
const setup = (res) => {
    let request_body = {
        get_started: {
            payload: 'get started'
        },
        persistent_menu:[
            {
              locale: 'default',
              composer_input_disabled: true,
              call_to_actions:[
                {
                  title: '💬 Menu',
                  type: 'nested',
                  call_to_actions:[
                    {
                        title: '🗂 Topics',
                        type: 'nested',
                        call_to_actions: [
                            messages.postbackButton('🛰 Technology', 'topic-tech')
                        ]
                    }
                  ]
                }
              ]
            }
          ]
    };
    callSendAPI(request_body, 'messenger_profile');
    res.status(200).send('SETUP_COMPLETED');
};


module.exports = {
    setup
}

