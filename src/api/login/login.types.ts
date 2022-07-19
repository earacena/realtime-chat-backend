import {
  Number as RtNumber,
  String as RtString,
  Record as RtRecord,
} from 'runtypes';

export const LoginRequest = RtRecord({
  username: RtString,
  password: RtString,
});

export const AuthResponse = RtRecord({
  token: RtString,
  id: RtNumber,
  username: RtString,
  name: RtString,
});
