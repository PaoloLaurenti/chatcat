'use strict';
const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');

let _registerRoutes = (routes, method) => {
  for (let key in routes) {
    if (typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
      _registerRoutes(routes[key], key);
    } else {
      if (method === 'get') {
        router.get(key, routes[key]);
      } else if (method === 'post') {
        router.post(key, routes[key]);
      } else {
        router.use(routes[key]);
      }
    }
  }
};

let route = routes => {
  _registerRoutes(routes);
  return router;
};

// Find a single user based on a key
let findOne = profileID => {
  return db.userModel.findOne({
    'profileId': profileID
  });
};

// Create a new user and returns that instance
let createNewUser = profile => {
  return new Promise((resolve, reject) => {
    let newChatUser = new db.userModel({
      profileId: profile.id,
      fullName: profile.displayName,
      profilePic: profile.photos[0].value || ''
    });

    newChatUser.save(error => {
      if (error) {
        reject(error);
      } else {
        resolve(newChatUser);
      }
    });
  });
};

let findById = id => {
  return new Promise((resolve, reject) => {
    db.userModel.findById(id, (error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
}

// A middleware that checks to see if the user is authenticated & logged in
let isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

// Find a chatroom by a given name
let findRoomByName = (allrooms, room) => {
  let findRoom = allrooms.findIndex((element, index, array) => {
    if (element.room === room) {
      return true;
    } else {
      return false;
    }
  });

  return findRoom > -1 ? true : false;
};

// A function that generates a unique roomID
let randomHex = () => {
  return crypto.randomBytes(24).toString('hex');
};

// Find a chatroom with a given Id
let findRoomById = (allRooms, roomId) => {
  return allRooms.find((element, index, array) => {
    if (element.roomId === roomId) {
      return true;
    } else {
      return false;
    }
  });
};

// Add a user to a chatroom
let addUserToRoom = (allRooms, data, socket) => {
  // Get the room object
  let getRoom = findRoomById(allRooms, data.roomId);
  if (getRoom !== undefined) {
    // Get the active user's Id (ObjectId as used in session)
    let userId = socket.request.session.passport.user;
    // Check to see if this user already exists in the chatroom
    let checkUser = getRoom.users.findIndex((element, index, array) => {
      if (element.userId === userId) {
        return true;
      } else {
        return false;
      }
    });

    // If the user is already present in the room, remove him first
    if (checkUser > -1) {
      getRoom.users.splice(checkUser, 1);
    }

    // Push the user into the room's users array
    getRoom.users.push({
      socketId: socket.id,
      userId,
      user: data.user,
      userPic: data.userPic
    });

    // Join the room channel
    socket.join(data.roomId);

    // Return the updated room object
    return getRoom;
  }
};

module.exports = {
  route,
  findOne,
  createNewUser,
  findById,
  isAuthenticated,
  findRoomByName,
  findRoomById,
  randomHex,
  addUserToRoom
}
