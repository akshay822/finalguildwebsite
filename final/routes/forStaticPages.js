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

var connectionSchema = new mongoose.Schema({
  cid: Number,
  type: String,
  title: String,
  charname: String,
  description: String,
  where: String,
  when: String,
  time: String,
  userid: Number
});

var connection = mongoose.model('connection', connectionSchema, 'connections');

var urlencodedParser = bodyParser.urlencoded({extended: false});

router.use(session({secret: "milestone3"}));

router.get('/contact', function (req, res) {
  var sessionuid = require('./profileController').session;
  if(sessionuid){
    res.render('contact', { username: sessionuid.username, logged: true});
  }
  else{
    res.render('contact', {logged: false});
  }
});

router.get('/about', function (req, res) {
  var sessionuid = require('./profileController').session;
  if(sessionuid){
    res.render('about', { username: sessionuid.username, logged: true});
  }
  else{
    res.render('about', {logged: false});
  }
});

router.get('/connections', function (req, res) {
  var sessionuid = require('./profileController').session;

  if(sessionuid){
    connection.find({}).exec().then((docs) => {
      connection.distinct("type").exec().then((conntypes) => {
        res.render('connections', {connections: docs, conntypes: conntypes, username: sessionuid.username, logged: true});
        }).catch((err) => {return console.error(err);});
    }).catch((err) => {return console.error(err);});

  }
  else{
    connection.find({}).exec().then((docs) => {
      connection.distinct("type").exec().then((conntypes) => {
        res.render('connections', {connections: docs, conntypes: conntypes, logged: false});
        }).catch((err) => {return console.error(err);});
    }).catch((err) => {return console.error(err);});
  }
});

router.get('/newConnection', function (req, res) {
  var sessionuid = require('./profileController').session;
  if(sessionuid){
    res.render('newConnection', { username: sessionuid.username, logged: true, invalid: false});
  }
  else{
    res.render('newConnection', {logged: false, invalid: false});
  }
});

router.get('/*', function (req, res) {
  var sessionuid = require('./profileController').session;
  if(sessionuid){
    res.render('index', { logged: true, username: sessionuid.username});
  }
  else{
    res.render('index', {logged: false});
  }
});

module.exports = router;
module.exports.connection = mongoose.model('connection', connectionSchema, 'connections');
