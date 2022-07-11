import {
  Record as RtRecord,
  String as RtString,
  Number as RtNumber,
} from 'runtypes';

export const DecodedToken = RtRecord({
  token: RtString,
  id: RtNumber,
  name: RtString,
  username: RtString,
});
