import express from 'express';
import userControllers from './user.controllers';

const { createUserController } = userControllers;

const usersRouter = express.Router();

usersRouter.post('/', createUserController);

export default usersRouter;
