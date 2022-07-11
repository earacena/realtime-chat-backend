import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from './user.model';
import {
  createUserRequest,
  User as UserType,
  IdParam,
  AddContactRequest,
  RemoveContactBody,
} from './user.types';
import { DecodedToken } from '../../app.types';

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
    const { contactId, decodedToken } = AddContactRequest.check(req.body);
    const user = UserType.check(await User.findByPk(id));

    if (user.id !== decodedToken.id) {
      res
        .status(401)
        .json({ error: 'not authorized to do that' })
        .end();
      return;
    }

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
    const decodedToken = DecodedToken.check(req.body.decodedToken);

    if (user.id !== decodedToken.id) {
      res
        .status(401)
        .json({ error: 'not authorized to do that' })
        .end();
      return;
    }

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
    const { decodedToken, contactId } = RemoveContactBody.check(req.body);
    let user = UserType.check(await User.findByPk(id));

    if (decodedToken.id !== user.id) {
      res
        .status(401)
        .json({ error: 'not authorized to do this' })
        .end();

      return;
    }

    let results = await User.update(
      { contacts: user.contacts.filter((c) => c !== contactId) },
      { where: { id }, returning: true },
    );

    user = UserType.check(await User.findByPk(contactId));
    results = await User.update(
      { contacts: user.contacts.filter((c) => c.toString() !== id) },
      { where: { id: contactId }, returning: true },
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
