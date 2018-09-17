"use strict";

const bcrypt          = require('bcryptjs');

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

    //submit likes to db
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
    },

    //user registration/login helpers

    setCookie: (req, option, param) => {
      return req.session[option] = param;
    },

    passHasher: (password) => {
      let salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(password, salt);
    },

    hashCheck: (password, hash) => {
      return bcrypt.compareSync(password, hash);
    }, 

    saveUser: (userDoc, cb) => {
      db.collection('users').insertOne(userDoc, (err) => {
        if (err) throw err;

        cb(null, true);
      });

    },

    getUser: (username, cb) => {
      db.collection('users').findOne({'name': username}, (err, result) => {
        if (err) throw err;

        cb(null, result);
      })
    }

  };
}
