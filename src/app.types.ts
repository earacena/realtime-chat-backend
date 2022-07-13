import {
  Record as RtRecord,
  String as RtString,
  Number as RtNumber,
} from 'runtypes';

export const DecodedToken = RtRecord({
  id: RtNumber,
  username: RtString,
});
