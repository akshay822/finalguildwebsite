uid = 0;
var makeUser = function(fname, lname, email, address1, address2, city, state, zipcode, country, username, password){
  uid++;

  var createUserProfile = require('./../models/userProfile.js');
  sampleuser = new createUserProfile(uid);

  var user = {userid: uid, fname: fname, lname: lname, email: email, address1: address1, address2: address2, city: city, state: state,
                        zipcode: zipcode, country: country, username: username, password: password};
  return user;
};

module.exports.makeUser = makeUser;
