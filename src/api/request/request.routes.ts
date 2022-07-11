import express from 'express';
import requestControllers from './request.controllers';
import { auth } from '../../middleware';

const {
  createRequestController,
  getPendingRequestsForUserId,
  updateRequestController,
} = requestControllers;

const requestRouter = express.Router();

requestRouter.post('/', auth, createRequestController);
requestRouter.get('/pending/to/:id', auth, getPendingRequestsForUserId);
requestRouter.put('/:id', auth, updateRequestController);

export default requestRouter;
