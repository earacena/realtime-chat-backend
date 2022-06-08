import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from './user.model';
import { createUserRequest, User as UserType, IdParam } from './user.types';

const createUserController = async (req: Request, res: Response, next: NextFunction) => {
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

const getUserDetailsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = IdParam.check({ id: req.params['id'] });
    const user = UserType.check(await User.findByPk(id));

    const userDetails = {
      id: user.id,
      name: user.name,
      username: user.username,
    };

    res
      .status(200)
      .json(userDetails);
  } catch (error: unknown) {
    next(error);
  }
}

export default {
  createUserController,
  getUserDetailsController,
};
