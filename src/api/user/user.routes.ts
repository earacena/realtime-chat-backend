import express from 'express';
import userControllers from './user.controllers';

const { createUserController, getUserDetailsController } = userControllers;

const usersRouter = express.Router();

usersRouter.post('/', createUserController);
usersRouter.get('/details/:id', getUserDetailsController);

export default usersRouter;
