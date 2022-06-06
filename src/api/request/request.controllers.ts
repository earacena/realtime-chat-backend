import { Request, Response, NextFunction } from 'express';
import RequestModel from './request.model';
import { CreateRequestBody, GetPendingRequestsParam } from './request.types';

const createRequestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, toUser, fromUser } = CreateRequestBody.check(req.body);

    const newRequest = await RequestModel.create({
      type,
      toUser,
      fromUser,
    });

    res
      .status(201)
      .json(newRequest);

    return;
  } catch (error: unknown) {
    next(error);
  }
};

const getPendingRequestsForUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = GetPendingRequestsParam.check({ id: req.params['id'] });
    const requests = RequestModel.findAll({ where: { toUser: id } });

    res
      .status(200)
      .json(requests);
  } catch (error: unknown) {
    next(error);
  }
};

export default {
  createRequestController,
  getPendingRequestsForUserId,
};
