'use strict';
const passport = require('passport');
const config = require('../config');
const h = require('../helpers');
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = () => {
  // Invoked on done of authProcessor
  // It allows to add user's id to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Invoked whenever a user is requested to session by its id
  passport.deserializeUser((id, done) => {
    h.findById(id)
      .then(user => done(null, user))
      .catch(error => console.log('Error when deserializing the user'))
  });

  let authProcessor = (accessToken, refreshToken, profile, done) => {
    // Find a user in the local db using profile.id
    // If the user is found, return the user data using the done()
    // If the use is not found, create one in the local db and return
    h.findOne(profile.id)
    .then(result => {
      if (result) {
        done(null, result);
      } else {
        // Create a new user and return
        h.createNewUser(profile)
        .then(newChatUser => done(null, newChatUser))
        .catch(error => console.log('Create new user error: ' + error));
      }
    });
  }

  passport.use(new FacebookStrategy(config.fb, authProcessor));
};
