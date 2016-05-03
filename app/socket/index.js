'use strict';

module.exports = (io, app) => {
  let allRooms = app.locals.chatrooms;
  io.of('/roomsList').on('connection', socket => {
    console.log('Socket.io connected to client!');
  });
};
