var userConnection = require('./../models/userConnection.js');

class userProfile{
  constructor(uid, connectionsForUser){
    this._uid = uid;
    this._connectionsForUser = [];
  }

  addConnection(cid, rsvp){
    var alreadyIn = false;
    this._connectionsForUser.forEach(function(x){
      if(x._cid === parseInt(cid)){
        //if found, update rsvp
        x._rsvp = rsvp;
        alreadyIn = true;
      }
    });

    if(alreadyIn === false){
      this._connectionsForUser.push(new userConnection(parseInt(cid),rsvp));
    }

  }

  removeConnection(cid){
    this._connectionsForUser = this._connectionsForUser.filter(function(x){
      if(x._cid === parseInt(cid)){
      }
      else{
        return x;
      }
    });
  }

  updateConnection(userConnection){
    return userConnection._rsvp;
  }

  getConnections(){
    return this._connectionsForUser;
  }

  emptyProfile(){
    this._connectionsForUser= [];
  }
}

module.exports = userProfile;
