import { Server, Socket } from 'socket.io';
import {
  Number as RtNumber, String as RtString, Record as RtRecord,
} from 'runtypes';
import { v4 } from 'uuid';
import { verify as JwtVerify } from 'jsonwebtoken';
import chatEvent from './chatEvents.types';
import Message from './api/message/message.model';
import { SECRET_JWT_KEY } from './config';
import UserModel from './api/user/user.model';
import { User as UserType, UserArray } from './api/user/user.types';

const Users = new Map();

class Connection {
  socket: Socket;

  ioListener: Server;

  userId: number;

  username: string;

  constructor(ioListener: Server, socket: Socket) {
    this.socket = socket;
    this.ioListener = ioListener;
    const { token } = RtRecord({ token: RtString }).check(this.socket.handshake.auth);
    const decoded = RtRecord({
      id: RtNumber,
      username: RtString,
    }).check(JwtVerify(token, SECRET_JWT_KEY));
    this.userId = decoded.id;
    this.username = decoded.username;
    Users.set(this.username, this.socket.id);

    console.log('user connected: ', socket.id);

    socket.on('signal online', () => this.signalOnlineToContacts());
    socket.on('signal offline', () => this.signalOfflineToContacts());
    socket.on('signal online reply', (payloadJSON: unknown) => this.signalOnlineReply(payloadJSON));
    socket.on('receive all room messages', (payloadJSON: unknown) => this.receiveAllRoomMessages(payloadJSON));
    socket.on('send message', (payloadJSON: unknown) => this.sendMessage(payloadJSON));
    socket.on('private room request', (payloadJSON: unknown) => this.privateRoomRequest(payloadJSON));
    socket.on('join room', (payloadJSON: unknown) => this.joinRoom(payloadJSON));
    socket.on('request refresh', (payloadJSON: unknown) => this.sendRequestRefresh(payloadJSON));
    socket.on('contact refresh', (payloadJSON: unknown) => this.sendContactRefresh(payloadJSON));
    socket.on('contact request', (payloadJSON: unknown) => this.sendContactRequest(payloadJSON));
    socket.on('disconnect', () => this.disconnect());
  }

  async signalOnlineToContacts() {
    // retrieve contacts
    const user = UserType.check(await UserModel.findByPk(this.userId));
    const contactIds = user.contacts;
    // make list of contact ids to usernames
    const contacts = UserArray.check(
      await Promise.all(contactIds.map((id) => UserModel.findByPk(id))),
    );
    // find users that are online from usernames
    // send all those users a signal that user is online
    contacts.forEach((contact) => {
      if (contact && Users.has(contact.username)) {
        console.log(`signaling ${contact.username} (${Users.get(contact.username)})`);
        const signalOnlinePayload: string = JSON.stringify({
          id: this.userId,
          username: this.username,
        });
        this.socket.to(Users.get(contact.username)).emit('signal online', signalOnlinePayload);
      }
    });
  }

  async signalOnlineReply(payloadJSON: unknown) {
    const payload: unknown = JSON.parse(RtString.check(payloadJSON));
    const { username } = chatEvent.SignalOnlineReplyPayload.check(payload);
    const signalOnlinePayload: string = JSON.stringify({
      id: this.userId,
      username: this.username,
    });

    console.log(`signaling ${username} (${Users.get(username)})`);
    this.socket.to(Users.get(username)).emit('signal online reply', signalOnlinePayload);
  }

  async signalOfflineToContacts() {
    // retrieve contacts
    const user = UserType.check(await UserModel.findByPk(this.userId));
    const contactIds = user.contacts;
    // make list of contact ids to usernames
    const contacts = UserArray.check(
      await Promise.all(contactIds.map((id) => UserModel.findByPk(id))),
    );
    // find users that are online from usernames
    // send all those users a signal that user is online
    contacts.forEach((contact) => {
      if (contact && Users.has(contact.username)) {
        console.log(`signalling offline to ${contact.username} (${Users.get(contact.username)})`);
        const signalOfflinePayload: string = JSON.stringify({
          id: this.userId,
        });
        this.socket.to(Users.get(contact.username)).emit('signal offline', signalOfflinePayload);
      }
    });
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
    console.log(`${this.socket.id} sent ${message.recipientUsername} message: ${JSON.stringify(message)}`);

    // Store message in DB
    const newMessage = await Message.create({
      senderUsername: message.senderUsername,
      recipientUsername: message.recipientUsername,
      content: message.content,
    });

    const messagePayloadJSON: string = JSON.stringify({ message: newMessage });
    this.socket.to(Users.get(message.recipientUsername)).emit('receive message', messagePayloadJSON);
    this.socket.emit('receive message', messagePayloadJSON);
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

  sendContactRefresh(payloadJSON: unknown) {
    const payload: unknown = JSON.parse(RtString.check(payloadJSON));
    const { username } = RtRecord({ username: RtString }).check(payload);
    const id = Users.get(username);
    console.log(`Signaling ${username} (${id}) for new contacts `);
    this.socket.to(id).emit('contact refresh');
    this.socket.emit('contact refresh');
  }

  sendContactRequest(payloadJSON: unknown) {
    const payload: unknown = JSON.parse(RtString.check(payloadJSON));
    const { fromUser, toUser } = chatEvent.ContactRequestPayload.check(payload);
    const socketId = Users.get(toUser.username);

    console.log(`Signaling ${toUser.username} (${socketId}) to submit contact request `);

    const contactRequestPayload: string = JSON.stringify({ fromUser, toUser });
    this.socket.to(socketId).emit('contact request', contactRequestPayload);
  }

  disconnect() {
    console.log(`user disconnected ${this.socket.id}`);

    this.signalOfflineToContacts();
    Users.delete(this.username);

    const userDisconnectedPayloadJSON: string = JSON.stringify({ userSocketId: this.socket.id });
    this.socket.broadcast.emit('user disconnected', userDisconnectedPayloadJSON);
  }
}

export default Connection;
