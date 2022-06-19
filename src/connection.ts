import { Server, Socket } from 'socket.io';
import { Number as RtNumber, String as RtString, Record as RtRecord } from 'runtypes';
import { v4 } from 'uuid';
import { verify as JwtVerify } from 'jsonwebtoken';
import chatEvent from './chatEvents.types';
import Message from './api/message/message.model';
import { SECRET_JWT_KEY } from './config';

const Users = new Map();

class Connection {
  socket: Socket;

  ioListener: Server;

  username: string;

  constructor(ioListener: Server, socket: Socket) {
    this.socket = socket;
    this.ioListener = ioListener;
    const { token } = RtRecord({ token: RtString }).check(this.socket.handshake.auth);
    const decoded = RtRecord({
      id: RtNumber,
      username: RtString,
    }).check(JwtVerify(token, SECRET_JWT_KEY));
    this.username = decoded.username;
    Users.set(this.username, this.socket.id);

    console.log('user connected: ', socket.id);

    const userConnectedPayloadJSON: string = JSON.stringify({ userSocketId: socket.id });
    this.socket.broadcast.emit('user connected', userConnectedPayloadJSON);

    // const allSockets = await io.fetchSockets();
    // const allSocketIds = allSockets.map((s) => s.id);
    // const allConnectedUsersPayloadJSON: string = JSON.stringify({
    //   allUserSocketIds: allSocketIds
    // });

    // socket.emit('all connected users', allConnectedUsersPayloadJSON);
    socket.on('receive all room messages', (payloadJSON: unknown) => this.receiveAllRoomMessages(payloadJSON));
    socket.on('send message', (payloadJSON: unknown) => this.sendMessage(payloadJSON));
    socket.on('private room request', (payloadJSON: unknown) => this.privateRoomRequest(payloadJSON));
    socket.on('join room', (payloadJSON: unknown) => this.joinRoom(payloadJSON));
    socket.on('request refresh', (payloadJSON: unknown) => this.sendRequestRefresh(payloadJSON));
    socket.on('disconnect', () => this.disconnect());
  }

  async receiveAllRoomMessages(payloadJSON: unknown) {
    const payload: unknown = JSON.parse(RtString.check(payloadJSON));
    const { roomId } = chatEvent.ReceiveAllRoomMessagesPayload.check(payload);
    const messages = await Message.findAll({ where: { roomId } });

    const messagesPayloadJSON: string = JSON.stringify({ messages });
    this.socket.emit('receive all room messages', messagesPayloadJSON);
  }

  async sendMessage(payloadJSON: unknown) {
    const payload: unknown = JSON.parse(RtString.check(payloadJSON));
    const { message } = chatEvent.MessagePayload.check(payload);
    console.log(`${this.socket.id} sent room ${message.roomId} message: ${message}`);

    // Store message in DB
    const newMessage = await Message.create({
      senderId: message.senderId,
      roomId: message.roomId,
      content: message.content,
    });

    const messagePayloadJSON: string = JSON.stringify({ newMessage });
    this.socket.to(message.roomId).emit('receive message', messagePayloadJSON);
  }

  privateRoomRequest(payloadJSON: unknown) {
    const payload: unknown = JSON.parse(RtString.check(payloadJSON));
    const { userSocketId } = chatEvent.PrivateRoomRequestPayload.check(payload);
    const newRoomId: string = v4();

    console.log(`${this.socket.id} sent ${userSocketId} room request, new room is: ${newRoomId}`);

    let privateRoomRequestPayloadJSON: string = JSON.stringify({
      userSocketId: this.socket.id,
      roomId: newRoomId,
    });
    this.socket.to(userSocketId).emit('private room request', privateRoomRequestPayloadJSON);

    // Send the same request to request in order to create room
    privateRoomRequestPayloadJSON = JSON.stringify({
      userSocketId,
      roomId: newRoomId,
    });
    this.socket.emit('private room request', privateRoomRequestPayloadJSON);
  }

  joinRoom(payloadJSON: unknown) {
    const payload: unknown = JSON.parse(RtString.check(payloadJSON));
    const { roomId } = RtRecord({ roomId: RtString }).check(payload);
    console.log(`${this.socket.id} is joining room ${roomId}`);
    this.socket.join(roomId);
  }

  sendRequestRefresh(payloadJSON: unknown) {
    const payload: unknown = JSON.parse(RtString.check(payloadJSON));
    const { username } = RtRecord({ username: RtString }).check(payload);
    const id = Users.get(username);
    console.log(`Signaling ${username} (${id}) for pending requests `);
    this.socket.to(id).emit('request refresh');
  }

  disconnect() {
    console.log(`user disconnected ${this.socket.id}`);

    Users.delete(this.username);

    const userDisconnectedPayloadJSON: string = JSON.stringify({ userSocketId: this.socket.id });
    this.socket.broadcast.emit('user disconnected', userDisconnectedPayloadJSON);
  }
}

export default Connection;
