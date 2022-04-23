import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Record as RtRecord, String as RtString } from 'runtypes';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost.localdomain:3000',
  },
});

const ChatMessageType = RtRecord({
  timestamp: RtString,
  message: RtString,
});

io.on('connection', (socket) => {
  console.log('a user connected: ', socket.id);

  socket.broadcast.emit('new user', socket.id);

  socket.on('message', (payload) => {
    try {
      const { timestamp, message } = ChatMessageType.check(JSON.parse(payload));
      console.log(`user [${socket.id}] sent message [${timestamp}]:  ${message}`);
      socket.broadcast.emit('message', payload);
    } catch (error: unknown) {
      console.error(error);
    }
  });

  socket.on('private message', (message, senderSocketId) => {
    socket.to(senderSocketId).emit('private message', message, senderSocketId);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected: ', socket.id);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
