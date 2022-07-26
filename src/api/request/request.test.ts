import supertest from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../app';
import Request from "./request.model";

import { AuthResponse } from "../login/login.types";

const api = supertest(app.app);
jest.mock('jsonwebtoken');
jest.mock('sequelize');
jest.mock('../request/request.model');
jest.mock('bcrypt');

describe('Request API', () => {

});
