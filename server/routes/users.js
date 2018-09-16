"use strict";

const userHelper     = require("../lib/util/user-helper")
const bodyParser     = require("body-parser");
const express        = require('express');
const userRoutes   = express.Router();


userRoutes.use(bodyParser.urlencoded({ extended: false }));

//callbacks for login/register functions
module.exports = (DataHelpers) => {

  //call getTweets with callback
  userRoutes.get("/login", (req, res) => {


  });

  //call saveTweet with callback
  userRoutes.post("/login", (req, res) => {

    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request' });
      return;
    }

    //create random user JSON template
    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: 0
    };

  //pass values to index.js
  return userRoutes;
}
