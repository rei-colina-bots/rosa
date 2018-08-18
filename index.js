'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  messages = require("./helpers/messages.js"),
  api = require('./helpers/api.js'),
  bot = require("./helpers/bot.js"),
  text = require("./constants/text.js"),
  config = require("./constants/config.js"),
  events = require("./constants/events.js"),
  postback = require("./handlers/postback.js"),
  app = express().use(bodyParser.json()); // creates express http server

// Set up the template engine
app.set('views', '/views')
app.set('view engine', 'jade')

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
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
      
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

// Sharing page
app.get('/share', (req, res) => {
  res.render('index', { title : 'Share' });
});

// Handles messages events
async function handleMessage(sender_psid, received_message) {
    let response;
    
    api.sendAction(sender_psid, events.MARK_SEEN);
    api.sendAction(sender_psid, events.TYPING_ON);

    // Check if the message contains text
    if (received_message.text) {
      response = messages.text(text.COMING_SOON);
    }  
    
    // Stop typing
    api.sendAction(sender_psid, events.TYPING_OFF);

    // Sends the response message
    api.sendMessage(sender_psid, response);
}

// Handles messaging_postbacks events
async function  handlePostback(sender_psid, received_postback) {
    let response;

    // Start typing
    api.sendAction(sender_psid, events.MARK_SEEN);

    // Get the payload for the postback
    let payload = received_postback.payload;
  
    // Set the response based on the postback payload
    api.sendAction(sender_psid, events.TYPING_ON);


    if (payload === events.GET_STARTED) {
      response = postback.handleGetStarted();
    } else if((payload === events.TOPIC_TECH)) {
      response = await postback.handleFeed(events.TOPIC_TECH);
    } else if(payload === events.MENU_SOCIAL) {
      response = postback.handleSocialNetworks();
    } else if(payload === events.TOPIC_REUTERS) {
      response = await postback.handleFeed(events.TOPIC_REUTERS);
    } else if(payload === events.TOPIC_ENT_LEAD) {
      response = await postback.handleFeed(events.TOPIC_ENT_LEAD);
    } else {
        response = messages.text(text.COMING_SOON);
    }

    // Stop typing
    api.sendAction(sender_psid, events.TYPING_OFF);

    // Send the message to acknowledge the postback
    api.sendMessage(sender_psid, response);
}
