'use strict';

var config = require('../config');
var Mongoose = require('mongoose').connect(config.dbURI);

Mongoose.connection.on('error', error => {
  console.log('MongoDB error: ',  error);
});

const chatUser = new Mongoose.Schema({
  profileId: String,
  fullName: String,
  profilePic: String
});

// Turn the schema into a usable model
let userModel = Mongoose.model('chatUser', chatUser);

module.exports = {
  Mongoose,
  userModel
};
