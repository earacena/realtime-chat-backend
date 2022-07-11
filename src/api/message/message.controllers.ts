import { Request, Response, NextFunction } from 'express';
import { MessageArray, SenderRecipientParams } from './message.types';
import Message from './message.model';
import { DecodedToken } from '../user/user.types';

const getMessagesBySenderRecipientController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { senderUsername, recipientUsername } = SenderRecipientParams.check(req.query);
    const decodedToken = DecodedToken.check(req.body.decodedToken);

    if (decodedToken.username !== senderUsername) {
      res
        .status(401)
        .json({ error: 'not authorized to do that' })
        .end();
      return;
    }

    // Get messages between two users
    const senderMessages = MessageArray.check(
      await Message.findAll({ where: { senderUsername, recipientUsername } }),
    );

    const recipientMessages = MessageArray.check(
      await Message.findAll({
        where: {
          senderUsername: recipientUsername,
          recipientUsername: senderUsername,
        },
      }),
    );

    // Combine messages into a single array of all messages between users
    const allMessages = senderMessages.concat(recipientMessages).sort();

    res.status(200).json(allMessages);
  } catch (error: unknown) {
    next(error);
  }
};

export default {
  getMessagesBySenderRecipientController,
};
