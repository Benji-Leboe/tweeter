"use strict";

//express setup and dependency config
require('dotenv').config();

const $               = process.env;
const cluster         = require('cluster');
const PORT            = $.PORT;
const express         = require("express");
const bodyParser      = require("body-parser");
const cookieSession   = require('cookie-session');
const app             = express();

const { MongoClient } = require("mongodb");
const MONGODB_URI     = $.MONGODB_URI;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieSession({
  name: 'session',
  keys: [$.KEY1, $.KEY2]
}));

if (cluster.isMaster) {

  const WORKERS = process.env.WEBB_CONCURRENCY || 1;

  for (let i = 0; i < WORKERS; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {

    console.log('Worker %d died:', worker.id);
    cluster.fork();

  });

} else {

//connect to MongoDB and route modules
MongoClient.connect(MONGODB_URI, (err, db) => {
  console.log('Worker %d running:', cluster.worker.id);

  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);

    throw err;
  }

  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  //require get and save tweet functions
  const DataHelpers = require("./lib/data-helpers.js")(db);

  //origin for tweet function callbacks + routing
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  const userRoutes = require("./routes/users")(DataHelpers);

  app.use("/tweets", tweetsRoutes);
  app.use("/tweets/likes", tweetsRoutes);
  app.use("/tweets/register", userRoutes);
  app.use("/tweets/login", userRoutes);

});

app.listen(PORT, () => {
  console.log('Worker %d running:', cluster.worker.id);
  console.log("Example app listening on port " + PORT);
});

}


