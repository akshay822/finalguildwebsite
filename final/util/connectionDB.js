var makeConnection = require('./../models/connection.js');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/itis4166', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var connection = require('./../routes/forStaticPages.js').connection;


var getConnections = function(){
  connection.find({}).exec().then((docs) => {
  return docs;
  }).catch((err) => {return console.error(err);});
};

var getConnection = function(cid){
  connection.find({ cid: parseInt(cid) }, function(err, docs){
    if(err) return console.error(err);
    return docs;
  });
};





//module.exports = allconnections;
