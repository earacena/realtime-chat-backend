import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from './user.model';
import { createUserRequest, User as UserType } from './user.types';

const createUserController = async (req: Request, res: Response) => {
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
    console.log(error);
  }
};

export default {
  createUserController,
};
