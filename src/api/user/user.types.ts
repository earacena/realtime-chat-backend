import {
  Number as RtNumber,
  String as RtString,
  Record as RtRecord,
  Static as RtStatic,
  Array as RtArray,
  Union as RtUnion,
  InstanceOf as RtInstanceOf,
  ValidationError,
} from 'runtypes';

export const User = RtRecord({
  id: RtNumber,
  name: RtString,
  username: RtString,
  passwordHash: RtString,
  dateRegistered: RtUnion(
    RtInstanceOf(Date),
    RtString.withConstraint((x: string) => (x || x !== null || typeof x === 'string' || !Number.isNaN(Date.parse(x)))),
  ),
});

export const createUserRequest = RtRecord({
  name: RtString,
  username: RtString,
  password: RtString,
});

export const UserArray = RtArray(User);
export type Users = RtStatic<typeof UserArray>;
export const RtValidationError = RtInstanceOf(ValidationError);
