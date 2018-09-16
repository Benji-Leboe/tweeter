"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {

  //require ObjectId function from Mongo
  let ObjectId = require('mongodb').ObjectID;

  //pass functions to index.js to be used by tweetRoutes
  return {

    // Saves a tweet to `db`
    saveTweet: (newTweet, cb) => {
      db.collection('tweeter').insertOne(newTweet, (err) => {

        if (err) throw err;

        cb(null, true);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: (cb) => {
      db.collection('tweeter').find().toArray( (err, tweet) => {

        if (err) throw err;

        cb(null, tweet);
      });
    },

    saveLikes: (post_id, post_likes, cb) => {
      db.collection('tweeter').findOneAndUpdate(
        
        { '_id': ObjectId(post_id) },
        { $set: { 'likes': post_likes } },
        {
          projection: { '_id': 1, 'likes': 1 },
          returnOriginal: false
        },
        (err, result) => {

        if (err) throw err;

        console.log(result);

        cb(null, true);
      });
    }

  };
}
