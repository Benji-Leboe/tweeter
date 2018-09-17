"use strict";

require('dotenv').config();

const $               = process.env;

const userHelper     = require("../lib/util/user-helper");


const express        = require('express');
const tweetsRoutes   = express.Router();
const cookieSession  = require('cookie-session');
const bodyParser     = require("body-parser");
const ObjectId       = require('mongodb').ObjectID;

tweetsRoutes.use(bodyParser.urlencoded({ extended: false }));
tweetsRoutes.use(bodyParser.json());
tweetsRoutes.use(cookieSession
({
  name: 'session',
  keys: [$.KEY1, $.KEY2]
}));


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
      created_at: Date.now(),
      likes: 0
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

  tweetsRoutes.put("/likes", (req, res) => {

    if (!req.body) {
      res.status(400).json({ error: 'No data sent' });
      return;
    }

    const { postID, likes } = req.body;

    DataHelpers.saveLikes(postID, likes, (err) => {

      if (err) {
        res.status(500).json({ error: err.message });

      } else {
        res.status(201).send();
        console.log('like successful!');

      }
    });

  });

  //user db routes

  tweetsRoutes.get("/cookie", (req, res) => {
    let cookie = req.session;
    res.status(201).json(cookie);
  });

  tweetsRoutes.get('/users', (req, res) => {
    //GET USERS FROM DB;
  });

  tweetsRoutes.post('/register', (req, res) => {
    console.log('request received');
    console.log(req.body);

    let id = ObjectId();
    let { username, handle, password, passwordCheck } = req.body;

    
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
        console.log(userDoc);
        console.log("Registration success!");
      }
    });

    DataHelpers.setCookie(req, "user_id", id);
  });

  tweetsRoutes.post("/login", (req, res) => {
    let username = req.body.userLogin;
    let password = req.body.passwordLogin;

    if (!username || !password) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }

    DataHelpers.getUser(username, (err, user) => {
      if (err) {
        res.status(500).json({ err: err.message });

      } else {
        console.log(user);
        if (DataHelpers.hashCheck(password, user.password)) {
          DataHelpers.setCookie(req, "user_id", user.id);
          res.status(201).json(user);
        } else {
          res.status(500).json({ err: 'Invalid username or password' });
          return;
        }
      }
    });
    
  });

  tweetsRoutes.post('/logout', (req, res) => {
    req.session = null;
    res.status(201).send();
  });

  //pass values to index.js
  return tweetsRoutes;
}
