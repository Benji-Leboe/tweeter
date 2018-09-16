"use strict";

// Basic express setup:
const cluster         = require('cluster');
const PORT            = 8080;
const express         = require("express");
const bodyParser      = require("body-parser");
const methodOverride  = require("method-override");
const bcrypt          = require('bcrypt');
const cookieSession   = require('cookie-session');
const app             = express();
const { MongoClient } = require("mongodb");
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

app.use(methodOverride('X-HTTP-Method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

if (cluster.isMaster) {

  const cpuCount = require('os').cpus().length;

  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {

    console.log('Worker %d died:', worker.id);
    cluster.fork();

  });

} else {

//connect to MongoDB and route modules
MongoClient.connect(MONGODB_URI, (err, db) => {

  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);

    throw err;
  }

  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  //require get and save tweet functions
  const DataHelpers = require("./lib/data-helpers.js")(db);

  //origin for tweet function callbacks + routing
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  
  app.use("/tweets", tweetsRoutes);
  app.use("/tweets/likes", tweetsRoutes);

});

app.listen(PORT, () => {
  console.log('Woker %d running:', cluster.worker.id)
  console.log("Example app listening on port " + PORT);
});

}


