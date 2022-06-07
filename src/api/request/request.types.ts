import {
  String as RtString,
  Number as RtNumber,
  Record as RtRecord,
  Union as RtUnion,
  InstanceOf as RtInstanceOf,
} from 'runtypes';

export const CreateRequestBody = RtRecord({
  type: RtString,
  toUser: RtString,
  fromUserId: RtNumber,
});

export const GetPendingRequestsParam = RtRecord({
  id: RtString,
});

export const Request = RtRecord({
  id: RtNumber,
  type: RtString,
  dateRequested: RtUnion(
    RtInstanceOf(Date),
    RtString.withConstraint((x: string) => (x && x !== null && typeof x === 'string' && !Number.isNaN(Date.parse(x)))),
  ),
  fromUser: RtNumber,
  toUser: RtNumber,
  status: RtString,
});
