import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 } from 'uuid';
// import { Record as RtRecord, String as RtString } from 'runtypes';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost.localdomain:3000',
  },
});

io.on('connection', async (socket) => {
  console.log('user connected: ', socket.id);

  socket.broadcast.emit('user connected', socket.id);
  const allSockets = await io.fetchSockets();
  const allSocketIds = allSockets.map((s) => s.id);
  socket.emit('all connected users', allSocketIds);

  socket.on('message', (userSocketId, message) => {
    socket.broadcast.emit('message', userSocketId, message);
  });

  socket.on('private message', (roomId, message) => {
    socket.to(roomId).emit('private message', roomId, socket.id, message);
  });

  socket.on('friend request', (userId) => {
    const newRoomId: string = v4();
    socket.to(userId).emit('friend request', socket.id, newRoomId);
    socket.emit('add room', newRoomId);
  });

  socket.on('join room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('disconnect', () => {
    // console.log('a user disconnected: ', socket.id);

    socket.emit('user disconnected', socket.id);
  });
});

server.listen(3001, () => {
  console.log('socket.io listening on localhost:3001');
});
