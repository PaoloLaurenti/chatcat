'use strict';

module.exports = (io, app) => {
  let allRooms = app.locals.chatrooms;

  allRooms.push({
    room: 'Good Food',
    roomId: '0001',
    users: []
  });

  allRooms.push({
    room: 'Cloud Computing',
    roomId: '0002',
    users: []
  });

  io.of('/roomsList').on('connection', socket => {
    socket.on('getChatRooms', () => {
      socket.emit('chatRoomsList', JSON.stringify(allRooms));
    });
  });
};
