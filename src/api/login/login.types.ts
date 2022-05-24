import {
  String as RtString,
  Record as RtRecord,
} from 'runtypes';

export default RtRecord({
  username: RtString,
  password: RtString,
});
