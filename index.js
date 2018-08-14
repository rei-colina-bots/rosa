'use strict';

// To test the webhook:
// curl -X GET "localhost:1337/webhook?hub.verify_token=<YOUR_VERIFY_TOKEN>&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
// curl -H "Content-Type: application/json" -X POST "localhost:1337/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  messages = require("./helpers/messages.js"),
  articles = require("./helpers/articles.js"),
  utils = require('./helpers/utils.js'),
  api = require('./helpers/api.js'),
  bot = require("./helpers/bot.js"),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));


// Creates the endpoint for our webhook.
// It accepts POST requests, checks the request is a webhook event,
// then parses the message. This endpoint is where the Messenger Platform
// will send all webhook events.
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
        } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        }
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });


// Adds support for GET requests to our webhook.
// This code adds support for the Messenger Platform's webhook verification
// to the webhook. This is required to ensure your webhook is
// authentic and working.
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "<YOUR_VERIFY_TOKEN>";
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });

// Endpoint to set up the bot's main configuration
app.get('/setup', (req, res) => {
    bot.setup(res);
});

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;
    
    api.sendAction(sender_psid, 'mark_seen');
    api.sendAction(sender_psid, 'typing_on');

    // Check if the message contains text
    if (received_message.text) {    
      // Create the payload for a basic text message
      response = messages.text('You sent the message: "${received_message.text}".')
    }  
    
    // Sends the response message
    api.sendMessage(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;

    api.sendAction(sender_psid, 'mark_seen');
  
    // Get the payload for the postback
    let payload = received_postback.payload;
  
    // Set the response based on the postback payload
    api.sendAction(sender_psid, 'typing_on');
    if (payload === 'get started') {
      response = messages.text('There is a menu down below 👇🏼 where you can ask to get the latest articles from topics that I currently support');
    } else if((payload === 'topic-tech')) {
        var i;
        var techArticles = articles.getTech();
        var cards = [];
        for (i = 0; i < 3; i++) {
            var buttons = [
                messages.webURLButton('Share on Facebook', utils.getShareLink('fb', techArticles[i].title, techArticles[i].url)),
                messages.webURLButton('Share on Twitter', utils.getShareLink('tw', techArticles[i].title, techArticles[i].url)),
                messages.webURLButton('Share on LinkedIn', utils.getShareLink('li', techArticles[i].title, techArticles[i].url))
            ];
            cards.push(messages.card(techArticles[i].title, '', '', techArticles[i].url, buttons));
        }
        response = messages.carousel(cards);
    }

    // Send the message to acknowledge the postback
    api.sendMessage(sender_psid, response);
}
