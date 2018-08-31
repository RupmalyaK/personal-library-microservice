'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const MongoClient = require('mongodb').MongoClient;
const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');
const noCache = require("nocache");
const hidePoweredBy = require('hide-powered-by');
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: 

const app = express();
app.use(noCache());
app.use(hidePoweredBy({"setTo":"PHP 4.2.0"}));
app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });



//For FCC testing purposes
fccTestingRoutes(app);

MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true } , (err, client) => {

  const db = client.db("personal-library");
  
  
  
  
  
  apiRoutes(app , db);
  
  
  
  
  //404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});
  
});

//Routing for API 

    


//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        const error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for unit/functional testing
