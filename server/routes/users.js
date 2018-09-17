"use strict";

require('dotenv').config();

const $              = process.env;

const userHelper     = require("../lib/util/user-helper");
const bodyParser     = require("body-parser");
const express        = require('express');
const userRoutes     = express.Router();
const cookieSession  = require('cookie-session');
const ObjectId = require('mongodb').ObjectID;

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
  });

  userRoutes.post('/register', (req, res) => {
    let id = ObjectId();
    let username = req.body.userReg;
    let handle = req.body.userHandle;
    let password = req.body.passwordReg;
    let passwordCheck = req.body.passwordConfirm;

    if (!username || password !== passwordCheck){
      res.status(400).json({ error: 'Invalid request' })
      return;
    }
    //WRITE LOGIC TO QUERY EXISTING USERS FROM DB
    let hashedPass = DataHelpers.passHasher(password);
    let userDoc = userHelper.generateUser(id, username, handle, hashedPass);

    DataHelpers.saveUser(userDoc, (err) => {
      if (err) {
        res.status(500).json({ err: err.message });
      } else {
        res.status(201).send();
      }
    });

    DataHelpers.setCookie(req, "user_id", id);
  });

  //pass values to index.js
  return userRoutes;
  
}