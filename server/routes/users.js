"use strict";

require('dotenv').config();

const $              = process.env;

const userHelper     = require("../lib/util/user-helper");
const bodyParser     = require("body-parser");
const express        = require('express');
const userRoutes     = express.Router();
const cookieSession  = require('cookie-session');
const ObjectId       = require('mongodb').ObjectID;

userRoutes.use(bodyParser.urlencoded({ extended: false }));
userRoutes.use(cookieSession({
  name: 'session',
  keys: [$.KEY1, $.KEY2]
}));


//callbacks for login/register functions
module.exports = (DataHelpers) => {
  userRoutes.get("/cookie", (req, res) => {
    let cookie = req.session;
    res.status(201).json(cookie);
  }) 
  //call userLogin with callback
  userRoutes.post("/login", (req, res) => {
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
        console.log(userDoc);
        console.log("Registration success!");
      }
    });

    DataHelpers.setCookie(req, "user_id", id);
  });

  userRoutes.post('/logout', (req, res) => {
    req.session = null;
    res.status(201).send();
  });

  //pass values to index.js
  return userRoutes;
  
}