var makeConnection = require('./../models/connection.js');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/itis4166', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var user = require('./../routes/profileController.js').user;


var getAllUsers = function(){
  user.find({}).exec().then((docs) => {
    return docs;
  }).catch((err) => {return console.error(err);});
};

var getUser = function(userid){
  user.findOne({ userid: parseInt(userid) }, function(err, docs){
    if(err) return console.error(err);
    return docs;
  });
};




var getConnections = function(){
  return allconnections;
};

var getConnection = function(id){
  return allconnections.find(x => x.id === id);
};
