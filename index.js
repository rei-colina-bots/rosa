'use strict';

// To test the webhook:
// curl -X GET "localhost:1337/webhook?hub.verify_token=<YOUR_VERIFY_TOKEN>&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
// curl -H "Content-Type: application/json" -X POST "localhost:1337/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  app = express().use(bodyParser.json()); // creates express http server

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

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

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;
    // Start "typing"
    sendAction(sender_psid, 'typing_on');
    
    sendAction(sender_psid, 'mark_seen');

    // Check if the message contains text
    if (received_message.text) {    
  
      // Create the payload for a basic text message
      response = {
        "text": `You sent the message: "${received_message.text}".`
      }
    }  
    
    // Sends the response message
    sendMessage(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

function sendMessage(sender_psid, message) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": message
    }
    sendAction(sender_psid, 'typing_off');
    callSendAPI(request_body);
}

function sendAction(sender_psid, action) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": action
    }
    callSendAPI(request_body);
}

// Sends response messages via the Send API
function callSendAPI(request_body) {
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
            console.log(body);
        } else {
            console.error("Unable to send message:" + err);
        }
    }); 
}