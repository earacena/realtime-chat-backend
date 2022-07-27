import supertest from 'supertest';
import { Request, Response, NextFunction } from 'express';
import app from '../../app';
import RequestModel from './request.model';
import User from '../user/user.model';
import { Request as RequestType } from './request.types';

const api = supertest(app.app);
jest.mock('sequelize');
jest.mock('../request/request.model');
jest.mock(
  '../../middleware/authenticate.middleware',
  () => (req: Request, _res: Response, next: NextFunction) => {
    req.body.decodedToken = {
      id: 1,
      username: 'mockuser1',
    };

    next();
  },
);
describe('Request API', () => {
  beforeAll(() => {
    const mockedUsers = [
      {
        id: 1,
        name: 'Mock User 1',
        username: 'mockuser1',
        passwordHash: 'password_hash',
        dateRegistered: new Date(Date.now()).toDateString(),
        contacts: [],
      },
      {
        id: 2,
        name: 'Mock User 2',
        username: 'mockuser2',
        passwordHash: 'password_hash',
        dateRegistered: new Date(Date.now()).toDateString(),
        contacts: [],
      },
    ];

    const mockedRequests = [
      {
        id: 1,
        type: 'contact',
        dateRequested: new Date(Date.now()).toDateString(),
        fromUser: 2,
        toUser: 1,
        status: 'pending',
      },
    ];

    (User.findOne as jest.Mock).mockResolvedValue(mockedUsers[1]);
    (RequestModel.create as jest.Mock).mockResolvedValue(mockedRequests[0]);
    (RequestModel.findAll as jest.Mock).mockResolvedValue(mockedRequests[0]);
  });

  describe('when creating', () => {
    test('successfully creates a request', async () => {
      const response = await api
        .post('/api/requests/')
        .set('Authorization', 'bearer token')
        .send({
          type: 'contact',
          fromUserId: 1,
          toUser: 'mockuser2',
        });

      const request = RequestType.check(JSON.parse(response.text));

      expect(request).toBeDefined();
      expect(request.id).toBe(1);
      expect(request.type).toBe('contact');
      expect(request.status).toBe('pending');
      expect(request.fromUser).toBe(2);
      expect(request.toUser).toBe(1);
    });
  });

  describe('when retrieving', () => {
    test('successfully retrieves pending requests', () => {});
  });

  describe('when updating', () => {
    test('successfully updates request status to "rejected"', () => {});
    test('successfully creates a request to "accepted"', () => {});
  });
});
