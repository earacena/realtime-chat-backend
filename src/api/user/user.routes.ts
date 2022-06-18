import express from 'express';
import userControllers from './user.controllers';

const {
  createUserController,
  getUserDetailsController,
  addContactController,
  getContactsController,
} = userControllers;

const usersRouter = express.Router();

usersRouter.post('/', createUserController);
usersRouter.get('/details/:id', getUserDetailsController);
usersRouter.get('/:id/contacts', getContactsController);
usersRouter.put('/:id/contacts', addContactController);

export default usersRouter;
