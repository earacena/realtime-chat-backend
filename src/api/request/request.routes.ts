import express from 'express';
import requestControllers from './request.controllers';

const { createRequestController, getPendingRequestsForUserId } = requestControllers;

const requestRouter = express.Router();

requestRouter.post('/', createRequestController);
requestRouter.get('/pending/to/:id', getPendingRequestsForUserId);

export default requestRouter;
