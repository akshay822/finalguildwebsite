var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var router = express.Router();
const { check, validationResult } = require('express-validator');

//using javascript-built in library 'crypto' for hashing and salting passwords using sha-256 algorithm
var crypto = require('crypto');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/itis4166', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var nextCid = 16;

var userConnectionSchema = new mongoose.Schema({
  userid: Number,
  cid: Number,
  rsvp: String,
});

var userSchema = new mongoose.Schema({
  userid: Number,
  fname: String,
  lname: String,
  email: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zipcode: Number,
  country: String,
  username: String,
  password: String
});

var userConnection = mongoose.model('userConnection', userConnectionSchema, 'userConnections');
var user = mongoose.model('user', userSchema, 'users');
var connection = require('./forStaticPages.js').connection;

var urlencodedParser = bodyParser.urlencoded({extended: false});
router.use(bodyParser.urlencoded({ extended: true }));

router.use(session({secret: "milestone3"}));

//helper function to load saved profile and render profile page
var renderPage = function(req, res){
  user.findOne({userid: parseInt(req.session.uid)}).exec().then((doc) => {

    userConnection.find({userid: parseInt(req.session.uid)}).exec().then((allUserConnections) => {

      connection.find({}).exec().then((docs) =>{

        req.session.uid = doc.userid;

        var username = doc.fname;

        req.session.username = username;

        module.exports.session = req.session;

        res.render('savedConnections', {sessionuid: req.session.uid, username: req.session.username, allUserConnections: allUserConnections, allConnections: docs, commandvalue: 0});

      }).catch((err) => {return console.error(err);});

    }).catch((err) => {return console.error(err);});

  }).catch((err) => {return console.error(err);});
};

var renderUpdatePage = function(req, res, updateID){

  user.findOne({userid: parseInt(req.session.uid)}).exec().then((doc) => {

    connection.findOne({cid: updateID}).exec().then((conn) => {

      req.session.uid = doc.userid;

      var username = doc.fname;

      req.session.username = username;

      module.exports.session = req.session;

      res.render('updateConnection', {logged: true, invalid: false, sessionuid: req.session.uid, username: req.session.username, conn: conn});

    }).catch((err) => {return console.error(err);});

  }).catch((err) => {return console.error(err);});
};

//get request to retrieve signup page, if logged in then redirect to their profile
router.get('/signup', function (req, res){
  if(req.session.uid){
    renderPage(req, res);
  }
  else{
    res.render('signup', {logged: false, invalid: false});
  }

});

//post request logic for signing up, requirements stated on the page if they are not met
router.post('/signUp', [
    check('fname').isAlpha().escape(),
    check('lname').isAlpha().escape(),
    check('email').isEmail().escape(),
    check('address1').matches(/^$|^[a-z0-9., ]+$/i).escape(),
    check('address2').escape(),
    check('city').matches(/^$|^[a-z.\- ]+$/i).escape(),
    check('state').matches(/^$|^[a-z.,\- ]+$/i).escape(),
    check('country').matches(/^$|^[a-z.\-, ]+$/i).escape(),
    check('zipcode').matches(/^$|^[0-9.\- ]+$/i).escape(),
    check('username').isAlphanumeric().escape(),
    check('password').isLength({min: 2}).escape(),
  ], urlencodedParser, function (req, res){

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors);
    res.render('signup', {logged: false, invalid: true});
    return;
  }

  user.countDocuments({}).exec().then((doc) => {
    var numUsers = parseInt(doc)+1;

    var salt = req.body.fname;

    var hashEnteredPassword = crypto.createHmac('sha256', salt).update(req.body.password).digest('hex');

    newUser = new user({userid: parseInt(numUsers), fname: req.body.fname, lname: req.body.lname, email: req.body.email, address1: req.body.address1, address2: req.body.address2, city: req.body.city, state: req.body.state, country: req.body.country, zipcode: req.body.zipcode, username: req.body.username, password: hashEnteredPassword});

    newUser.save(function(err){
      if (err) return console.error(err);
      req.session.uid = parseInt(numUsers);
      renderPage(req, res);
    });

  }).catch((err) => {return console.error(err);});

});

//get request for login page, if logged in show their profile
router.get('/login', function (req, res){
  if(req.session.uid){
    renderPage(req, res);
  }
  else{
    res.render('login', {logged: false, invalid: false, notFound: false});
  }

});

//handle post request sign in
router.post('/signIn', [
    check('username').isAlphanumeric().escape(),
    check('password').isLength({min: 2}).escape(),
  ], urlencodedParser, function (req, res){

  const errors = validationResult(req)
  if (!errors.isEmpty()) {

    res.render('login', {logged: false, invalid: true, notFound: false});
    return;
  }

  user.findOne({username: req.body.username}).exec().then((doc) => {
    if(doc){

      var salt = doc.fname;

      var hashEnteredPassword = crypto.createHmac('sha256', salt).update(req.body.password).digest('hex');

      if(hashEnteredPassword === doc.password){
        req.session.uid = doc.userid;
        renderPage(req, res);
      }
      else{
        res.render('login', {logged: false, invalid: false, notFound: true});
      }
    }
    else{
      res.render('login', {logged: false, invalid: false, notFound: true});
    }
  }).catch((err) => {return console.error(err);});
});

//handle get requests to saved profile, show profile if logged in, if not redirect to login page
router.get('/', function (req, res) {

  if(req.session.uid){

    renderPage(req, res);

  }
  else{
    res.render('login', {logged: false, invalid: false, notFound: false});

  }

});

//post request sent to profileController for add, maybe, no, or delete
//also provides checks for whether user is creator of connection
router.post('/', urlencodedParser, function (req, res) {
  try{
    var sessionuid = require('./profileController').session;
    req.session.uid = sessionuid.uid;
    if(sessionuid.uid){
      if(req.body.signOut === "signOut"){

        console.log("commencing signout, destroying session and redirecting to index logged false");

        req.session.destroy();

        module.exports.session = req.session;

        res.render('index', { logged: false});
        return;
      }

      if(req.body.list === "listitems"){

        renderPage(req, res);

      }

      if(req.body.delete === "delete" || req.body.command === "add" || req.body.command === "maybe" || req.body.command === "no" || req.body.update === "creator"){
        userConnection.findOne({userid: parseInt(req.session.uid), cid: parseInt(req.body.commandid)}).exec().then((userConn) =>{
          if(!userConn){
            if(req.body.command === "add"){
              var addConnection = new userConnection({userid: parseInt(req.session.uid), cid: parseInt(req.body.commandid), rsvp: "Yes"});
              addConnection.save(function(err){
                if (err) return console.error(err);
                renderPage(req, res);
              });
            }
            else if(req.body.command === "maybe"){
              var maybeConnection = new userConnection({userid: parseInt(req.session.uid), cid: parseInt(req.body.commandid), rsvp: "Maybe"});
              maybeConnection.save(function(err){
                if (err) return console.error(err);
                renderPage(req, res);
              });
            }
            else if(req.body.command === "no"){
              var noConnection = new userConnection({userid: parseInt(req.session.uid), cid: parseInt(req.body.commandid), rsvp: "No"});
              noConnection.save(function(err){
                if (err) return console.error(err);
                renderPage(req, res);
              });
            }
            else{

            }
          }
          else{
            //we are not the creator, so we update, otherwise do nothing
            if(userConn.rsvp !== "Creator"){
              if(req.body.command === "add"){
                userConnection.update({userid: parseInt(req.session.uid), cid: parseInt(req.body.commandid)}, {$set: {rsvp: "Yes"}}).exec();
                renderPage(req, res);
              }
              else if(req.body.command === "maybe"){
                userConnection.update({userid: parseInt(req.session.uid), cid: parseInt(req.body.commandid)}, {$set: {rsvp: "Maybe"}}).exec();
                renderPage(req, res);
              }
              else if(req.body.command === "no"){
                userConnection.update({userid: parseInt(req.session.uid), cid: parseInt(req.body.commandid)}, {$set: {rsvp: "No"}}).exec();
                renderPage(req, res);
              }
              else if(req.body.delete === "delete"){
                //we are not the creator so we only remove the connection from our(the user's) connections list
                userConnection.remove({userid: parseInt(req.session.uid), cid: parseInt(req.body.commandid)}).exec();
                renderPage(req, res);

              }
              else{
                renderPage(req, res);
              }
            }
            else{
              if(req.body.delete === "delete"){
                if(userConn.rsvp === "Creator"){
                  //we are (the user) the creator and are requesting for a delete, so we delete it from our list as well as everyone's list
                  //and even delete it from all available connections
                  userConnection.remove({cid: parseInt(req.body.commandid)}).exec();

                  connection.remove({cid: parseInt(req.body.commandid)}).exec();

                  renderPage(req, res);

                }
              }
              else if(req.body.update === "creator"){
                updateID = parseInt(req.body.commandid);

                renderUpdatePage(req, res, updateID);
              }
              else{
                renderPage(req, res);
              }

            }

          }

        }).catch((err) => {return console.error(err);});


      }

    }
  }
  catch{
    if(req.body.signOut === "signOut"){

      console.log("commencing signout, destroying session and redirecting to index logged false");

      req.session.destroy();

      module.exports.session = req.session;

      res.render('index', { logged: false});
      return;
    }

    if(req.body.list === "listitems"){

      user.findOne({fname: req.body.username}).exec().then((doc) => {

        req.session.uid = doc.userid;

        userConnection.find({userid: parseInt(req.session.uid)}).exec().then((allUserConnections) => {

          connection.find({}).exec().then((docs) =>{

            var username = doc.fname;

            req.session.username = req.body.username;

            module.exports.session = req.session;

            res.render('savedConnections', {sessionuid: req.session.uid, username: req.session.username, allUserConnections: allUserConnections, allConnections: docs, commandvalue: 0});

          }).catch((err) => {return console.error(err);});

        }).catch((err) => {return console.error(err);});

      }).catch((err) => {return console.error(err);});
    }

    if(req.body.command){
      console.log("not logged in get connections");
      res.redirect('connections');
    }
  }
});

//post request logic for updating a connection
router.post('/updateConnection', [
    check('connectiontype').escape(),
    check('charname').isAlpha().escape(),
    check('details').not().isEmpty().trim().escape(),
    check('where').matches(/^[a-z0-9.:/,'\- ]+$/i).escape(),
    check('date').matches(/^[a-z0-9.:/\-_,(),' ]+$/i).escape(),
    check('time').matches(/^[a-z0-9.:/(),'\- ]+$/i).escape()
  ], urlencodedParser, function(req, res) {
  var sessionuid = require('./profileController').session;
  req.session.uid = sessionuid.uid;

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors);

    connection.findOne({cid: parseInt(req.body.updateCID)}).exec().then((conn) =>{
      res.render('updateConnection', {logged: true, invalid: true, sessionuid: req.session.uid, username: req.session.username, conn: conn});
    }).catch((err) => {return console.error(err);});

    return;
  }

  if(!req.body.connectiontype || !req.body.title || !req.body.charname || !req.body.details || !req.body.where || !req.body.date || !req.body.time){
    connection.findOne({cid: parseInt(req.body.updateCID)}).exec().then((conn) =>{
      res.render('updateConnection', {logged: true, invalid: true, sessionuid: req.session.uid, username: req.session.username, conn: conn});
    }).catch((err) => {return console.error(err);});

    return;
  }
  else{
    connection.findOne({cid: parseInt(req.body.updateCID)}).exec().then((doc) => {

      if(doc){

        doc.type = req.body.connectiontype;
        doc.title = req.body.title;
        doc.charname = req.body.charname;
        doc.description = req.body.details;
        doc.where = req.body.where;
        doc.when = req.body.date;
        doc.time = req.body.time;
        doc.save(function(err){
          if (err) return console.error(err);
          res.redirect('/connection?id='+req.body.updateCID);
        });
        return;
      }
      else{
        res.render('updateConnection', {logged: true, invalid: true, sessionuid: req.session.uid, username: req.session.username, conn: conn});
      }

    }).catch((err) => {return console.error(err);});
  }

});

//post request logic for adding a new connection, requirements stated on the page if they are not met
router.post('/newConnection', [
    check('connectiontype').escape(),
    check('charname').isAlpha().escape(),
    check('details').not().isEmpty().trim().escape(),
    check('where').matches(/^[a-z0-9.:/,' ]+$/i).escape(),
    check('date').matches(/^[a-z0-9.:/\-_,(),' ]+$/i).escape(),
    check('time').matches(/^[a-z0-9.:/(),'\- ]+$/i).escape()
  ], urlencodedParser, function(req, res) {
  var sessionuid = require('./profileController').session;
  req.session.uid = sessionuid.uid;

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors);
    res.render('newConnection', {logged: true, sessionuid: req.session.uid, username: sessionuid.username, invalid: true});
    return;
  }

  if(!req.body.connectiontype || !req.body.title || !req.body.charname || !req.body.details || !req.body.where || !req.body.date || !req.body.time){
    res.render('newConnection', {logged: true, sessionuid: req.session.uid, username: sessionuid.username, invalid: true});
  }
  else{
    connection.findOne({type: req.body.connectiontype, title: req.body.title, charname: req.body.charname, description: req.body.details, where: req.body.where, when: req.body.date, time: req.body.time }).exec().then((doc) => {

      if(doc){
        res.render('newConnection', {logged: true, sessionuid: req.session.uid, username: sessionuid.username, invalid: true});
      }
      else{

        nextCid += 1;
        newConnection = new connection({cid: parseInt(nextCid), type: req.body.connectiontype, title: req.body.title, charname: req.body.charname, description: req.body.details, where: req.body.where, when: req.body.date, time: req.body.time, userid: parseInt(sessionuid.uid)});
        newConnection.save(function(err){
          if (err) return console.error(err);
          var newUserConnection = new userConnection({userid: parseInt(req.session.uid), cid: parseInt(nextCid), rsvp: "Creator"});
          newUserConnection.save(function(err){
            if (err) return console.error(err);
            renderPage(req, res);
          });
        });
      }

    }).catch((err) => {return console.error(err);});
  }

});


module.exports = router;
module.exports.user = mongoose.model('user', userSchema, 'users');
module.exports.userConnection = mongoose.model('userConnection', userConnectionSchema, 'userConnections');
