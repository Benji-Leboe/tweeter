"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {

  //pass functions to index.js to be used by tweetRoutes
  return {

    // Saves a tweet to `db`
    saveTweet: function (newTweet, cb) {
      db.collection('tweeter').insertOne(newTweet, (err) => {

        if (err) throw err;

        cb(null, true);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function (cb) {
      db.collection('tweeter').find().toArray( (err, tweet) => {

        if (err) throw err;

        cb(null, tweet);
      });
    }

  };
}
