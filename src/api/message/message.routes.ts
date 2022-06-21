import express from 'express';
import messageControllers from './message.controllers';

const {
  getMessagesBySenderRecipientController,
} = messageControllers;

const messageRouter = express.Router();

messageRouter.get('/', getMessagesBySenderRecipientController);

export default messageRouter;
