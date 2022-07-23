import supertest from 'supertest';
import { Request, Response, NextFunction } from 'express';
import {
  Array as RtArray,
  Number as RtNumber,
  Record as RtRecord,
} from 'runtypes';
import app from '../../app';
import User from './user.model';
import { User as UserType, UserDetails } from './user.types';

jest.mock('./user.model');
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
const api = supertest(app.app);

describe('User API', () => {
  const mockedUsers = [
    {
      id: 1,
      name: 'Mocked User 1',
      username: 'mockuser1',
      // bcrypt hash for password 'testpassword'
      passwordHash:
        '$2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW',
      dateRegistered: new Date(Date.now()).toDateString(),
      contacts: [2, 3],
    },
    {
      id: 2,
      name: 'Mocked User 2',
      username: 'mockuser2',
      // bcrypt hash for password 'testpassword'
      passwordHash:
        '$2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW',
      dateRegistered: new Date(Date.now()).toDateString(),
      contacts: [1, 3],
    },
    {
      id: 3,
      name: 'Mocked User 3',
      username: 'mockuser3',
      // bcrypt hash for password 'testpassword'
      passwordHash:
        '$2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW',
      dateRegistered: new Date(Date.now()).toDateString(),
      contacts: [1, 2],
    },
  ];

  beforeAll(() => {
    (User.findByPk as jest.Mock).mockResolvedValue(mockedUsers[0]);
    (User.create as jest.Mock).mockResolvedValue({
      id: 4,
      name: 'Mocked User 4',
      username: 'mockuser4',
      passwordHash:
        '$2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW',
      dateRegistered: new Date(Date.now()).toDateString(),
      contacts: [],
    });
  });

  describe('when retrieving users', () => {
    test('successfully gets user details by id', async () => {
      const response = await api.get('/api/users/details/1').expect(200);
      const user = UserDetails.check(JSON.parse(response.text));
      expect(user).toBeDefined();
      expect(user.id).toBe(1);
      expect(user.name).toBe('Mocked User 1');
      expect(user.username).toBe('mockuser1');
    });

    test('successfully gets user contacts', async () => {
      const response = await api.get('/api/users/1/contacts').expect(200);
      const { contacts } = RtRecord({ contacts: RtArray(RtNumber) }).check(
        JSON.parse(response.text),
      );
      expect(contacts).toBeDefined();
      expect(contacts).toHaveLength(2);
      expect(contacts[1]).toBe(3);
    });
  });

  describe('when creating users', () => {
    test('successfully creates user', async () => {
      const newUser = {
        name: 'Mock User 4',
        username: 'mockuser4',
        password: 'testpassword',
      };

      const response = await api.post('/api/users').send(newUser).expect(201);

      const user = UserType.check(JSON.parse(response.text));

      expect(user).toBeDefined();
      expect(user.username).toBe('mockuser4');
      expect(user.name).toBe('Mocked User 4');
      expect(user.id).toBe(4);
      expect(user.passwordHash).toBeDefined();
      expect(user.contacts).toHaveLength(0);
    });
  });
  describe('when adding', () => {
    test('successfully adds a contact', async () => {
      (User.update as jest.Mock).mockResolvedValueOnce([
        '1',
        [
          {
            id: 1,
            name: 'Mocked User 1',
            username: 'mockuser1',
            // bcrypt hash for password 'testpassword'
            passwordHash:
              '$2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW',
            dateRegistered: new Date(Date.now()).toDateString(),
            contacts: [2, 3, 4],
          },
        ],
      ]);

      const response = await api
        .put('/api/users/1/contacts')
        .send({ contactId: 4 })
        .set('Authorization', 'bearer token');

      const user = UserType.check(JSON.parse(response.text));

      expect(user).toBeDefined();
      expect(user.username).toBe('mockuser1');
      expect(user.name).toBe('Mocked User 1');
      expect(user.id).toBe(1);
      expect(user.passwordHash).toBeDefined();
      expect(user.contacts).toHaveLength(3);
      expect(user.contacts[2]).toBe(4);
    });
  });
});
