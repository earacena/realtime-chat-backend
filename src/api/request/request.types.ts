import {
  String as RtString,
  Number as RtNumber,
  Record as RtRecord,
} from 'runtypes';

export const CreateRequestBody = RtRecord({
  type: RtString,
  toUser: RtNumber,
  fromUser: RtNumber,
});

export const GetPendingRequestsParam = RtRecord({
  id: RtString,
});
