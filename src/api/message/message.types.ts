import {
  Record as RtRecord,
  String as RtString,
  Array as RtArray,
} from 'runtypes';

export const MessageType = RtRecord({
  roomId: RtString,
  senderId: RtString,
  content: RtString,
});

export const MessageArray = RtArray(MessageType);

export const RoomIdRequestParam = RtRecord({
  id: RtString,
});
