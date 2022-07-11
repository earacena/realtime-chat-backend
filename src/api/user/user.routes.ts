import express from 'express';
import userControllers from './user.controllers';
import { auth } from '../../middleware';

const {
  createUserController,
  getUserDetailsController,
  addContactController,
  getContactsController,
  removeContactController,
} = userControllers;

const usersRouter = express.Router();

usersRouter.post('/', createUserController);
usersRouter.get('/details/:id', getUserDetailsController);
usersRouter.get('/:id/contacts', auth, getContactsController);
usersRouter.put('/:id/contacts', auth, addContactController);
usersRouter.delete('/:id/contacts', auth, removeContactController);

export default usersRouter;
