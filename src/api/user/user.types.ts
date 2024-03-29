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
import { DecodedToken } from '../../app.types';

export const User = RtRecord({
  id: RtNumber,
  name: RtString,
  username: RtString,
  passwordHash: RtString,
  dateRegistered: RtUnion(
    RtInstanceOf(Date),
    RtString.withConstraint((x: string) => (x && x !== null && typeof x === 'string' && !Number.isNaN(Date.parse(x)))),
  ),
  contacts: RtArray(RtNumber),
});

export const createUserRequest = RtRecord({
  name: RtString,
  username: RtString,
  password: RtString,
});

export const UserArray = RtArray(User);
export type Users = RtStatic<typeof UserArray>;
export const RtValidationError = RtInstanceOf(ValidationError);

export const IdParam = RtRecord({
  id: RtString,
});

export const AddContactRequest = RtRecord({
  contactId: RtNumber,
  decodedToken: DecodedToken,
});

export const RemoveContactBody = RtRecord({
  contactId: RtNumber,
  decodedToken: DecodedToken,
});

export const UserDetails = RtRecord({
  id: RtNumber,
  name: RtString,
  username: RtString,
});
