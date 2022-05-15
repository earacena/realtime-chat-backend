import express from 'express';
import http from 'http';
import { String as RtString, Record as RtRecord } from 'runtypes';
import { Server } from 'socket.io';
import { v4 } from 'uuid';
import chatEvent from './chatEvents.types';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost.localdomain:3000',
  },
});

io.on('connection', async (socket) => {
  console.log('user connected: ', socket.id);

  const userConnectedPayloadJSON: string = JSON.stringify({ userSocketId: socket.id });
  socket.broadcast.emit('user connected', userConnectedPayloadJSON);

  const allSockets = await io.fetchSockets();
  const allSocketIds = allSockets.map((s) => s.id);
  const allConnectedUsersPayloadJSON: string = JSON.stringify({ allUserSocketIds: allSocketIds });
  socket.emit('all connected users', allConnectedUsersPayloadJSON);

  const sendMessageHandler = (payloadJSON: unknown) => {
    const payload: unknown = JSON.parse(RtString.check(payloadJSON));
    const { message } = chatEvent.MessagePayload.check(payload);
    console.log(`${socket.id} sent room ${message.roomId} message: ${message}`);

    const messagePayloadJSON: string = JSON.stringify({ message });
    socket.to(message.roomId).emit('receive message', messagePayloadJSON);
  };

  const privateRoomRequestHandler = (payloadJSON: unknown) => {
    const payload: unknown = JSON.parse(RtString.check(payloadJSON));
    const { userId } = chatEvent.PrivateRoomRequestPayload.check(payload);
    const newRoomId: string = v4();
    console.log(`${socket.id} sent ${userId} room request, new room is: ${newRoomId}`);

    let privateRoomRequestPayloadJSON: string = JSON.stringify({
      userSocketId: socket.id,
      roomId: newRoomId,
    });
    socket.to(userId).emit('private room request', privateRoomRequestPayloadJSON);

    // Send the same request to request in order to create room
    privateRoomRequestPayloadJSON = JSON.stringify({
      userSocketId: userId,
      roomId: newRoomId,
    });
    socket.emit('private room request', privateRoomRequestPayloadJSON);
  };

  const joinRoomHandler = (payloadJSON: unknown) => {
    const payload: unknown = JSON.parse(RtString.check(payloadJSON));
    const { roomId } = RtRecord({ roomId: RtString }).check(payload);
    console.log(`${socket.id} is joining room ${roomId}`);
    socket.join(roomId);
  };

  const disconnectHandler = () => {
    console.log(`user disconnected ${socket.id}`);

    const userDisconnectedPayloadJSON: string = JSON.stringify({ userSocketId: socket.id });
    socket.broadcast.emit('user disconnected', userDisconnectedPayloadJSON);
  };

  socket.on('send message', sendMessageHandler);
  socket.on('private room request', privateRoomRequestHandler);
  socket.on('join room', joinRoomHandler);
  socket.on('disconnect', disconnectHandler);
});

const main = () => {
  server.listen(3001, () => {
    console.log('socket.io listening on localhost:3001');
  });
};

export default { main };