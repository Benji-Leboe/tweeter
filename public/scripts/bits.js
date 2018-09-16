
// app.use(methodOverride('X-HTTP-Method'));
// app.use(methodOverride('X-HTTP-Method-Override'));
// app.use(methodOverride('X-Method-Override'));
// const methodOverride  = require("method-override");
const memjs          = require('memjs');
const mc = memjs.Client.
create(process.env.MEMCACHIER_SERVERS, {
  failover: true,  // default: false
  timeout: 1,      // default: 0.5 (seconds)
  keepAlive: true  // default: false
});


let cachedTweet = (req, res, next) => {
  let view_key = '_view_cache_' + req.originalUrl || req.url;
  mc.get(view_key, (err, val) => {
    if(err === null && val !== null){
      res.send(val.toString('utf8'));
      return;
    }
    res.sendRes = res.send;
    res.send = (body) => {
      mc.set(view_key, body, { expires: 0 }, 
      (err, val) => { if (err) throw err;});
      res.sendRes(body);
    }
    next();
  });
}