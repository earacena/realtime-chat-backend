import supertest from 'supertest';
import { Request, Response, NextFunction } from 'express';
import app from '../../app';
import 'sequelize';
import Message from './message.model';
import User from '../user/user.model';
import { MessageArray } from './message.types';

const api = supertest(app.app);

jest.mock('sequelize');
jest.mock('../user/user.model');
jest.mock('./message.model');
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

describe('Message API', () => {
  const mockedMessages = [
    {
      id: 2,
      senderUsername: 'mockuser2',
      recipientUsername: 'mockuser1',
      content: 'Hi!',
    },
  ];

  beforeAll(() => {
    (User.findByPk as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Mock User 1',
      username: 'mockuser1',
      passwordHash: 'password_hash',
      dateRegistered: new Date(Date.now()).toDateString(),
      contacts: [2],
    });
    (Message.findAll as jest.Mock).mockResolvedValue(mockedMessages);
  });

  describe('when retrieving Posts', () => {
    test('successfully retrieves sender and recipient messages', async () => {
      (Message.findAll as jest.Mock).mockResolvedValueOnce([
        {
          id: 1,
          senderUsername: 'mockuser1',
          recipientUsername: 'mockuser2',
          content: 'Hello!',
        },
      ]);
      const response = await api.get('/api/messages/?senderUsername=mockuser1&recipientUsername=mockuser2').expect(200);
      const messages = MessageArray.check(JSON.parse(response.text));

      expect(messages).toBeDefined();
      expect(messages).toHaveLength(2);
      expect(messages[0]?.content).toBe('Hello!');
      expect(messages[1]?.content).toBe('Hi!');
    });
  });
});
