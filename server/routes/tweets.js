"use strict";

const userHelper    = require("../lib/util/user-helper")

const bodyParser    = require("body-parser");
const express       = require('express');
const tweetsRoutes  = express.Router();
const methodOverride = require("method-override");

tweetsRoutes.use(bodyParser.urlencoded({ extended: false }));
tweetsRoutes.use(methodOverride('_method'));

//callbacks for database functions
module.exports = (DataHelpers) => {

  //call getTweets with callback
  tweetsRoutes.get("/", (req, res) => {

    DataHelpers.getTweets((err, tweets) => {

      if (err) {
        res.status(500).json({ error: err.message });

      } else {
        //sort function for tweets in db
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        res.json(tweets.sort(sortNewestFirst));
      }

    });

  });

  //call saveTweet with callback
  tweetsRoutes.post("/", (req, res) => {

    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body' });
      return;
    }

    //create random user JSON template
    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {

      if (err) {
        res.status(500).json({ error: err.message });

      } else {
        //pass tweet to app.js to prepend
        res.status(201).json(tweet);
      }

    });

  });

  //pass values to index.js
  return tweetsRoutes;
}
