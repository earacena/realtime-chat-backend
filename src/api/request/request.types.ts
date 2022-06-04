import {
  String as RtString,
  Number as RtNumber,
  Record as RtRecord,
} from 'runtypes';

export default RtRecord({
  type: RtString,
  toUser: RtNumber,
  fromUser: RtNumber,
});
