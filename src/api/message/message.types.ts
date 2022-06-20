import {
  Record as RtRecord,
  String as RtString,
  Array as RtArray,
} from 'runtypes';

export const MessageType = RtRecord({
  recipientUsername: RtString,
  senderUsername: RtString,
  content: RtString,
});

export const MessageArray = RtArray(MessageType);

export const SenderRecipientBody = RtRecord({
  senderUsername: RtString,
  recipientUsername: RtString,
});
