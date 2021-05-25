var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/itis4166', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var connection = require('./forStaticPages.js').connection;

var urlencodedParser = bodyParser.urlencoded({extended: false});

router.use(session({secret: "milestone3"}));

//handle get request for showing a specific connection, if id is invalid or does not exist,
//the page will redirect to the connections page
router.get('/', function (req, res) {
  var sessionuid = require('./profileController').session;

  if(sessionuid){
    if(Object.keys(req.query).length === 0){
      res.redirect('connections');
    }
    else if(Object.keys(req.query).length === 1){
      if(req.query.id){

        if(!parseInt(req.query.id)){
          res.redirect('connections');
          return;
        }

        connection.findOne({cid: parseInt(req.query.id)}).exec().then((docs) => {
          console.log(docs);
          if(!docs){
            res.redirect('connections');
            return;
          }
          res.render('connection', { theconnection: docs, username: sessionuid.username, userid: sessionuid.uid, logged: true });
        }).catch((err) => {return console.error(err);});

      }
      else{
        res.redirect('connections');
      }
    }
    else{
      res.render('connections', { username: sessionuid.username, logged: true});
    }
  }
  else{
    if(Object.keys(req.query).length === 0){
      res.redirect('connections');
    }
    else if(Object.keys(req.query).length === 1){
      if(req.query.id){

        if(!parseInt(req.query.id)){
          res.redirect('connections');
          return;
        }

        connection.findOne({cid: parseInt(req.query.id)}).exec().then((docs) => {
          console.log(docs);
          if(!docs){
            res.redirect('connections');
            return;
          }
          res.render('connection', { theconnection: docs, userid: 0, logged: false });
        }).catch((err) => {return console.error(err);});

      }
      else{
        res.redirect('connections');
      }
    }
    else{
      res.redirect('connections');
    }
  }
});

module.exports = router;
