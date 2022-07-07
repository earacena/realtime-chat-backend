import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import {
  Record as RtRecord,
  Number as RtNumber,
} from 'runtypes';
import User from './user.model';
import {
  createUserRequest,
  User as UserType,
  IdParam,
  AddContactRequest,
} from './user.types';

const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, username, password } = createUserRequest.check(req.body);
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = UserType.check(
      await User.create({
        name,
        username,
        passwordHash,
      }),
    );

    res.status(201).json(newUser);
  } catch (error: unknown) {
    next(error);
  }
};

const getUserDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = IdParam.check({ id: req.params['id'] });
    const user = UserType.check(await User.findByPk(id));

    const userDetails = {
      id: user.id,
      name: user.name,
      username: user.username,
    };

    res.status(200).json(userDetails);
  } catch (error: unknown) {
    next(error);
  }
};

const addContactController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = IdParam.check({ id: req.params['id'] });
    const user = UserType.check(await User.findByPk(id));
    const { contactId } = AddContactRequest.check(req.body);

    const { contacts } = user;
    if (!contacts.includes(contactId)) {
      const results = await User.update(
        { contacts: contacts.concat(contactId) },
        { where: { id }, returning: true },
      );

      const updatedUser = UserType.check(results[1][0]);
      res.status(200).json(updatedUser);

      return;
    }

    res.status(204);
  } catch (error: unknown) {
    next(error);
  }
};

const getContactsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = IdParam.check({ id: req.params['id'] });
    const user = UserType.check(await User.findByPk(id));
    res.status(200).json({ contacts: user.contacts });
  } catch (error: unknown) {
    next(error);
  }
};

const removeContactController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = IdParam.check({ id: req.params['id'] });
    const { contactId } = RtRecord({ contactId: RtNumber }).check(req.body);

    const { contacts } = UserType.check(await User.findByPk(id));
    const results = await User.update(
      { contacts: contacts.filter((c) => c !== contactId) },
      { where: { id }, returning: true },
    );

    const updatedUser = UserType.check(results[1][0]);
    res.status(200).json(updatedUser.contacts);
  } catch (error: unknown) {
    next(error);
  }
};

export default {
  createUserController,
  getUserDetailsController,
  addContactController,
  getContactsController,
  removeContactController,
};
