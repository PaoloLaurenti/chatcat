'use strict';

var config = require('../config');
var Mongoose = require('mongoose').connect(config.dbURI);

Mongoose.connection.on('error', error => {
  console.log('MongoDB error: ',  error);
});

module.exports = {
  Mongoose
};
