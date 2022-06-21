import {
  Record as RtRecord,
  String as RtString,
  Array as RtArray,
} from 'runtypes';

const MessageType = RtRecord({
  senderUsername: RtString,
  recipientUsername: RtString,
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
  userSocketId: RtString,
});

const ReceiveAllRoomMessagesPayload = RtRecord({
  roomId: RtString,
});

const chatEventType = {
  UserConnectedEventPayload,
  UserDisconnectedEventPayload,
  ConnectedUserListPayload,
  MessagePayload,
  MessagesPayload,
  PrivateRoomRequestPayload,
  ReceiveAllRoomMessagesPayload,
};

export default chatEventType;
