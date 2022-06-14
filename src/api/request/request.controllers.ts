import { Request, Response, NextFunction } from 'express';
import { String as RtString } from 'runtypes';
import RequestModel from './request.model';
import User from '../user/user.model';
import { User as UserType } from '../user/user.types';
import { CreateRequestBody, GetPendingRequestsParam, Request as RequestType } from './request.types';

const createRequestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, toUser, fromUserId } = CreateRequestBody.check(req.body);

    const user = UserType.check(await User.findOne({ where: { username: toUser } }));

    const newRequest = RequestType.check(
      await RequestModel.create({
        type,
        toUser: user.id,
        fromUser: fromUserId,
      }),
    );

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
    const requests = await RequestModel.findAll({ where: { toUser: id } });

    res
      .status(200)
      .json(requests);
  } catch (error: unknown) {
    next(error);
  }
};

const updateRequestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = RtString.check(req.params['id']);
    const request = RequestType.check(req.body);
    const { status } = request;
    const results = await RequestModel.update(
      { status },
      { where: { id }, returning: true },
    );

    const updatedRequest = RequestType.check(results[1][0]);

    res
      .status(200)
      .json(updatedRequest);
  } catch (error: unknown) {
    next(error);
  }
};

export default {
  createRequestController,
  getPendingRequestsForUserId,
  updateRequestController,
};
