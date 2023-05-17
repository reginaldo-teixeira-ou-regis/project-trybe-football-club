import * as sinon from 'sinon';
import * as chai from 'chai';
import jwtConfig from '../utils/jwtConfig';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import UserModel from '../database/models/UserModel';
import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Login Router', () => {
  
  afterEach(() => { sinon.restore(); });

  describe('POST /login', () => {

    let chaiHttpResponse: Response;

    it('Must return code 200 and token', async () => {
      sinon.stub(jwtConfig, 'sign').returns('token')
      sinon.stub(UserModel, 'findOne').resolves({
        id: 1,
        username: 'admin',
        role: 'admin',
        email: 'admin@admin.com',
        password: "senha_admin"
      } as UserModel)

      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'admin@admin.com',
        password: 'senha_admin'
      });

      expect(chaiHttpResponse.body.token).not.to.be.equal('token');
    });

    it('It should return code 400 and the message "All fields must be filled"',
      async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send({
          password: 'senha_admin'
        });

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(chaiHttpResponse.body).to.be.deep.equal(
          { message: 'All fields must be filled' }
        );
      });

    it('It should return code 400 and the message "All fields must be filled"',
      async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send({
          email: 'admin@admin.com',
        });

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(chaiHttpResponse.body).to.be.deep.equal(
          { message: 'All fields must be filled' }
        );
      });

    it('It should return code 400 and the message "All fields must be filled"',
      async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send({
          email: 'admin@admin',
          password: 'senha_admin'
        });

        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(chaiHttpResponse.body).to.be.deep.equal(
          { message: 'Invalid email or password' }
        );
      });

    it('It should return code 401 and the message "All fields must be filled"',
      async () => {
        sinon.stub(UserModel, 'findOne').resolves(undefined)
        chaiHttpResponse = await chai.request(app).post('/login').send({
          email: 'dffdvd@admin.com',
          password: 'senha_admin'
        });

        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(chaiHttpResponse.body).to.be.deep.equal(
          { message: 'Invalid email or password' }
        );
      });

    it('It should return code 401 and the message "All fields must be filled"',
      async () => {
        sinon.stub(UserModel, 'findOne').resolves({
          id: 1,
          username: 'admin',
          role: 'admin',
          email: 'admin@admin.com',
          password: "senha_admin"
        } as UserModel)
        chaiHttpResponse = await chai.request(app).post('/login').send({
          email: 'admin@admin.com',
          password: 'senha_ad'
        });

        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(chaiHttpResponse.body).to.be.deep.equal(
          { message: 'Invalid email or password' }
        );
      });
  });

  describe('GET /login/role', () => {

    let chaiHttpResponse: Response;

    it('It should return code 401 and the message "Token not found"',
      async () => {
        chaiHttpResponse = await chai.request(app).get('/login/role');

        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(chaiHttpResponse.body).to.be.deep.equal(
          { message: 'Token not found' }
        );
      });

    it('Should return code 401 - Given an invalid token', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/login/role')
        .set('Authorization', 'token-invalid');

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal(
        { message: 'Token must be a valid token' }
      );
    });

    it('Should return code 200 and the role - Given an valid token',
      async () => {
        sinon.stub(jwtConfig, 'verify').returns({
          email: 'admin@admin.com',
          password: 'senha_admin'
        });

        sinon.stub(UserModel, 'findOne').resolves(
          {
            id: 1,
            email: 'admin@admin.com',
            username: 'admin',
            role: 'admin',
            password: 'senha_admin',
          } as UserModel,
        );

        const response = await chai.request(app)
          .get('/login/role')
          .set('Authorization', 'token-valid');

        expect(response.status).to.be.equal(200);
        expect(response.body).to.be.deep.equal(
          { role: 'admin' }
        );
      });
  });
});