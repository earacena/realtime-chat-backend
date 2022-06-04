import express from 'express';
import requestControllers from './request.controllers';

const { createRequestController } = requestControllers;

const requestRouter = express.Router();

requestRouter.post('/', createRequestController);

export default requestRouter;
