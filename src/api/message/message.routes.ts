import express from 'express';
import messageControllers from './message.controllers';
import { auth } from '../../middleware';

const {
  getMessagesBySenderRecipientController,
} = messageControllers;

const messageRouter = express.Router();

messageRouter.get('/', auth, getMessagesBySenderRecipientController);

export default messageRouter;
