import {
  Record as RtRecord,
  String as RtString,
  Array as RtArray,
} from 'runtypes';

const MessageType = RtRecord({
  roomId: RtString,
  senderId: RtString,
  content: RtString,
});

const UserConnectedEventPayload = RtRecord({
  userSocketId: RtString,
});

const UserDisconnectedEventPayload = RtRecord({
  userSocketId: RtString,
});

const ConnectedUserListPayload = RtRecord({
  allUserSocketIds: RtArray(RtString),
});

const MessagePayload = RtRecord({
  message: MessageType,
});

const MessagesPayload = RtRecord({
  messages: RtArray(MessageType),
});

const PrivateRoomRequestPayload = RtRecord({
  userId: RtString,
});

const chatEventType = {
  UserConnectedEventPayload,
  UserDisconnectedEventPayload,
  ConnectedUserListPayload,
  MessagePayload,
  MessagesPayload,
  PrivateRoomRequestPayload,
};

export default chatEventType;
