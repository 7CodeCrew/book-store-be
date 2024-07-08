const { expect } = require('@jest/globals');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('../models/User'); // User 모델 경로에 맞게 수정
const userController = require('../controllers/user.controller'); // userController 경로에 맞게 수정

let mongoServer;

beforeAll(async () => {
  console.time('MongoMemoryServer setup');
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.timeEnd('MongoMemoryServer setup');

  console.time('Mongoose connect');
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.timeEnd('Mongoose connect');
});

afterAll(async () => {
  console.time('Mongoose disconnect');
  await mongoose.disconnect();
  console.timeEnd('Mongoose disconnect');

  console.time('MongoMemoryServer stop');
  await mongoServer.stop();
  console.timeEnd('MongoMemoryServer stop');
});

describe('UserController', () => {
  describe('createUser', () => {
    let req, res, userStub;

    beforeEach(() => {
      req = {
        body: {
          userName: 'testUser',
          email: 'test@example.com',
          password: 'password123',
          role: 'admin',
          level: 'gold',
          address: '123 Test St',
          phone: '123-456-7890',
        },
      };

      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      userStub = sinon.stub(User, 'findOne');
      sinon.stub(bcrypt, 'genSalt').resolves('salt');
      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
      sinon.stub(User.prototype, 'save').resolves();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should create a new user successfully', async () => {
      userStub.resolves(null);

      console.time('createUser');
      await userController.createUser(req, res);
      console.timeEnd('createUser');

      expect(res.status.calledWith(200)).toBe(true);
      expect(res.json.calledWith(sinon.match({ status: 'success' }))).toBe(true);
    });

    it('should return error if user already exists', async () => {
      userStub.resolves({ email: 'test@example.com' });

      console.time('createUserExists');
      await userController.createUser(req, res);
      console.timeEnd('createUserExists');

      expect(res.status.calledWith(400)).toBe(true);
      expect(res.json.calledWith(sinon.match({ status: 'fail', error: '이미 존재하는 이메일입니다.' }))).toBe(true);
    });

    it('should handle errors', async () => {
      userStub.rejects(new Error('DB Error'));

      console.time('createUserError');
      await userController.createUser(req, res);
      console.timeEnd('createUserError');

      expect(res.status.calledWith(400)).toBe(true);
      expect(res.json.calledWith(sinon.match({ status: 'fail', error: 'DB Error' }))).toBe(true);
    });
  });
});
