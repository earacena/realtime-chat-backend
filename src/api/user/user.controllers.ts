import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from './user.model';

const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      username,
      passwordHash,
    });

    res.status(201).json(newUser);
  } catch (error: unknown) {
    console.log(error);
  }
};

export default {
  createUserController,
};
