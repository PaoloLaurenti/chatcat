'use strict';
const h = require('../helpers');

module.exports = (io, app) => {
  let allRooms = app.locals.chatrooms;

  io.of('/roomsList').on('connection', socket => {
    socket.on('getChatRooms', () => {
      socket.emit('chatRoomsList', JSON.stringify(allRooms));
    });

    socket.on('createNewRoom', newRoomInput => {
      // check to see if a room with the same title exists or not
      // if not, create one and broadcast it to everyone
      if(!h.findRoomByName(allRooms, newRoomInput)) {
        //Create a new room and broadcast to all
        allRooms.push({
          room: newRoomInput,
          roomId: h.randomHex(),
          users: []
        });

        // Emit an updated list to the creator
        socket.emit('chatRoomsList', JSON.stringify(allRooms));
        // Emit an updated list to everyone connected to the rooms page
        socket.broadcast.emit('chatRoomsList', JSON.stringify(allRooms));
      }
    });
  });

  io.of('/chatter').on('connection', socket => {
    // Join a chatroom
    socket.on('join', data  => {
      let usersList = h.addUserToRoom(allRooms, data, socket);

      // Update the list of active users as shown on the chatroom page
      console.log('usersList: ', usersList);
    });
  });
};
