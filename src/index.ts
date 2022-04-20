import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost.localdomain:3000',
  },
});

io.on('connection', (socket) => {
  console.log('a user connected: ', socket.id);

  socket.on('message', (message) => {
    console.log('user [', socket.id, '] sent message: ', message);

    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected: ', socket.id);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
