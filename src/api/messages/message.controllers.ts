import { Request, Response, NextFunction } from 'express';
import { MessageArray, RoomIdRequestParam } from './message.types';
import Message from './message.model';

const getPostsByRoomIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId } = RoomIdRequestParam.check({ id: req.params['id'] });
    const messages = MessageArray.check(await Message.findAll({ where: { roomId } }));
    res.status(200).json(messages);
  } catch (error: unknown) {
    next(error);
  }
};
