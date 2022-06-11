import express from 'express';
import requestControllers from './request.controllers';

const {
  createRequestController,
  getPendingRequestsForUserId,
  updateRequestController,
} = requestControllers;

const requestRouter = express.Router();

requestRouter.post('/', createRequestController);
requestRouter.get('/pending/to/:id', getPendingRequestsForUserId);
requestRouter.put('/:id', updateRequestController);

export default requestRouter;
