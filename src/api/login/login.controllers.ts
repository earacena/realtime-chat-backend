import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import { sign as JwtSign } from 'jsonwebtoken';
import { String as RtString } from 'runtypes';
import User from '../user/user.model';
import { User as UserType } from '../user/user.types';
import { SECRET_JWT_KEY } from '../../config';

const loginController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = UserType.check(await User.findOne({ where: { username } }));

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordCorrect) {
      res.status(400).json({
        error: 'invalid credentials',
      });
      return;
    }

    // Group data needed to identify user when decoding token
    const userDetails = {
      id: user.id,
      username: user.username,
    };

    const token = RtString.check(JwtSign(userDetails, SECRET_JWT_KEY));

    res
      .status(200)
      .send({
        token,
        id: user.id,
        username: user.username,
        name: user.name,
      });
    return;
  } catch (error: unknown) {
    console.log(error);
  }
};

export default { loginController };
