import { Request, Response, NextFunction } from 'express';
import { MessageArray, SenderRecipientParams } from './message.types';
import Message from './message.model';

const getMessagesBySenderRecipientController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { senderUsername, recipientUsername } = SenderRecipientParams.check(req.query);

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
