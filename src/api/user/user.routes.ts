import express from 'express';
import userControllers from './user.controllers';

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
usersRouter.get('/:id/contacts', getContactsController);
usersRouter.put('/:id/contacts', addContactController);
usersRouter.delete('/:id/contacts', removeContactController);

export default usersRouter;
