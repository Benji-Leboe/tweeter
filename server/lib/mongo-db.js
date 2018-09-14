"use strict";

const {MongoClient} = require('mongodb');
const MONGODB_URI = "mongodb://localhost:27017/tweeter";


let _db;

module.exports = {

  mongoClient: function() {
    MongoClient.connect(MONGODB_URI, (err, db) => {
      if (err) return err;
      
      console.log(`Connected to mongodb: ${MONGODB_URI}`);
      return db;
      
    });
  },
  getDB: function(){
    return _db;
  },
  getTweets: function(cb) {
    db.collection('tweets').find().toArray(cb);
    
    db.close();
  }
}

