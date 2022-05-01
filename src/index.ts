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

  socket.on('message', (roomId, message) => {
    console.log(`${socket.id} sent room ${roomId} message: ${message}`);
    socket.to(roomId).emit('message', socket.id, roomId, message);
  });

  socket.on('private room request', (userId) => {
    const newRoomId: string = v4();
    console.log(`${socket.id} sent ${userId} room request, new room is: ${newRoomId}`);

    socket.to(userId).emit('private room request', socket.id, newRoomId);
    // Send the same request to request in order to create room
    socket.emit('private room request', userId, newRoomId);
  });

  socket.on('join room', (roomId) => {
    console.log(`${socket.id} is joining room ${roomId}`);
    socket.join(roomId);
  });

  socket.on('disconnect', () => {
    console.log(`user disconnected ${socket.id}`);

    socket.emit('user disconnected', socket.id);
  });
});

server.listen(3001, () => {
  console.log('socket.io listening on localhost:3001');
});
