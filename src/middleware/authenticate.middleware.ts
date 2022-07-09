import { NextFunction, Request, Response } from 'express';
import { verify as JwtVerify } from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config';

const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authorizationHeader = req.get('authorization');
  if (authorizationHeader && authorizationHeader.toLowerCase().startsWith('bearer ')) {
    const token = authorizationHeader.substring(7);
    req.body.decodedToken = JwtVerify(token, SECRET_JWT_KEY);
  }

  next();
};

export default authenticate;
