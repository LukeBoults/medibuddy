const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const app = require('../server');
const User = require('../models/User');
const bcrypt = require('bcrypt');

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth API', () => {
  before(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves({
        id: '12345',
        name: 'Luke',
        email: 'luke@example.com',
      });

      const res = await chai.request(app).post('/api/auth/register').send({
        name: 'Luke',
        email: 'luke@example.com',
        password: 'password123',
      });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id', '12345');
      expect(res.body).to.have.property('name', 'Luke');
      expect(res.body).to.have.property('email', 'luke@example.com');
      expect(res.body).to.have.property('token');
    });

    it('should return 400 if user already exists', async () => {
      sinon.stub(User, 'findOne').resolves({
        id: 'existing-user',
        email: 'luke@example.com',
      });

      const res = await chai.request(app).post('/api/auth/register').send({
        name: 'Luke',
        email: 'luke@example.com',
        password: 'password123',
      });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      sinon.stub(User, 'findOne').resolves({
        id: '12345',
        name: 'Luke',
        email: 'luke@example.com',
        password: 'hashedpassword',
      });

      sinon.stub(bcrypt, 'compare').resolves(true);

      const res = await chai.request(app).post('/api/auth/login').send({
        email: 'luke@example.com',
        password: 'password123',
      });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('id', '12345');
      expect(res.body).to.have.property('name', 'Luke');
      expect(res.body).to.have.property('email', 'luke@example.com');
      expect(res.body).to.have.property('token');
    });

    it('should return 401 for invalid credentials', async () => {
      sinon.stub(User, 'findOne').resolves({
        id: '12345',
        name: 'Luke',
        email: 'luke@example.com',
        password: 'hashedpassword',
      });

      sinon.stub(bcrypt, 'compare').resolves(false);

      const res = await chai.request(app).post('/api/auth/login').send({
        email: 'luke@example.com',
        password: 'wrongpassword',
      });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message', 'Invalid email or password');
    });
  });
});