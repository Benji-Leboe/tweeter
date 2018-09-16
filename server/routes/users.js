"use strict";

require('dotenv').config();

const $              = process.env;

const bodyParser     = require("body-parser");
const express        = require('express');
const userRoutes     = express.Router();
const cookieSession  = require('cookie-session');

userRoutes.use(bodyParser.urlencoded({ extended: false }));
userRoutes.use(cookieSession({
  name: 'session',
  keys: [$.KEY1, $.KEY2]
}));


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

    // //create random user JSON template
    // const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    // const tweet = {
    //   user: user,
    //   content: {
    //     text: req.body.text
    //   },
    //   created_at: Date.now(),
    //   likes: 0
    // };


    userRoutes.post('/register', (req, res) => {
      let username = req.body.userReg;
      let password = req.body.passwordReg;
      let passwordCheck = req.body.passwordConfirm;

      //WRTIE LOGIC TO QUERY EXISTING USERS FROM DB

    });

  //pass values to index.js
    return userRoutes;

  });
}