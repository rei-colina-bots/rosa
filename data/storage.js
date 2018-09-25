"use strict";

/*
* MEMORY
*
* Class to use data storage.
*/

const mongodb = require("mongodb");
const config = require("../constants/config.js");

// Default memory storage
global.memoryStorage = {};

// Create a database variable outside of the database connection callback to
// reuse the connection pool.
var db;

// ID Mapping
let getSearchQuery = function(entity, key) {
    if (entity === config.COLLECTION_USERS) {
        return { psid: key };
    }
    return {}
};

// Connect the Mongo DB.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready!");
});

module.exports = class Storage {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        // Initiate the default memory storage
        if (!memoryStorage[name]) {
            memoryStorage[name] = {};
        }
    }

    get(key) {
        if (this.type === config.STORAGE_TYPE_MONGO) {
            db.collection(this.name).findOne(
                getSearchQuery(config.COLLECTION_USERS, key), 
                function(err, doc) {
                if (err) {
                  console.log('Failed retrieve from DB. ' + err);
                } else {
                  return doc;
                }
              });
        } else {
            return memoryStorage[this.name][key];
        }
    }

    set(key, value) {
        if (this.type === config.STORAGE_TYPE_MONGO) {
            db.collection(this.name).updateOne(
                getSearchQuery(config.COLLECTION_USERS, key), { $set: value},
                {upsert: true},
                function(err, doc) {
                if (err) {
                    console.log('Failed update item in DB. ' + err);
                }
              });
        } else {
            memoryStorage[this.name][key] = value;
        }
    }

};
