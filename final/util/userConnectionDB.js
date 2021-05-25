var makeConnection = require('./../models/connection.js');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/itis4166', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var userConnection = require('./../routes/profileController.js').userConnection;
var connection = require('./../routes/forStaticPages.js').connection;


var getUserProfile = function(userid){
  userConnection.find({userid: parseInt(userid)}).exec().then((docs) => {
    return docs;
  }).catch((err) => {return console.error(err);});
};

var addRSVP = function(connectionid, userid, rsvp){
  userConnection.find({ userid: parseInt(userid), cid: parseInt(connectionid)}, function(err, docs){
    if(err) return console.error(err);
    if(docs){
      return;
    }
    else{
      newUserConnection = new userConnection({userid: parseInt(userid), cid: parseInt(connectionid), rsvp: rsvp});
      newUserConnection.save(function(err){
        if (err) return console.error(err);
      });
    }
  });
};

var updateRSVP = function(connectionid, userid, rsvp){
  userConnection.find({ userid: parseInt(userid), cid: parseInt(connectionid)}, function(err, docs){
    if(err) return console.error(err);
    if(docs){
      userConnection.update({userid: parseInt(userid), cid: parseInt(vonnectionid)}, {$set: {rsvp: rsvp}}).exec();
    }
    return;
  });
};

var addConnection = function(connection){
  connection.find({ cid: parseInt(connection.cid)}, function(err, docs){
    if(err) return console.error(err);
    if(docs){
      //cid already exists, i.e. connection already exists
      return;
    }
    else{
      newConnection = new connection({cid: parseInt(connection.cid), type: connection.type, title: connection.title, charname: connection.charname, description: connection.description, where: connection.where, date: connection.date, time: connection.time, userid: parseInt(connection.userid)});
      newConnection.save(function(err){
        if (err) return console.error(err);
      });
    }
  });
}
