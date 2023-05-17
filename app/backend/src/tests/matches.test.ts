import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
// import { MatchReturnAtributes } from './mocks';

import { Response } from 'superagent';
import mocks from '../utils/mocks';
import jwtConfig from '../utils/jwtConfig';

chai.use(chaiHttp);

const { expect } = chai;

describe('Matches Router', () => {

  afterEach(() => { sinon.restore(); });

  describe('GET /matches', () => {

    let chaiHttpResponse: Response;

    it('It should return the code 200 and the teams', async () => {
      sinon.stub(MatchModel, 'findAll').resolves(
        [mocks.mockMatches] as MatchModel[]
      )
      chaiHttpResponse = await chai.request(app).get('/matches');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal([mocks.mockMatches]);
    });

    it('It should return the code 200 and the teams in progress',
      async () => {
        sinon.stub(MatchModel, 'findAll').resolves(
          [mocks.mockMatchesInProgress] as MatchModel[])

        chaiHttpResponse = await chai.request(app)
          .get('/matches?inProgress=true');

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(
          [mocks.mockMatchesInProgress]
        );
      });
  });

  describe('POST /matches', () => {
    let chaiHttpResponse: Response;
    it('It should return the code 201 and the Match created', async () => {
      sinon.stub(jwtConfig, 'verify').returns({
        email: 'admin@admin.com',
        password: 'senha_admin'
      });
      sinon.stub(MatchModel, 'create').resolves(
        mocks.mockMatchesInProgress as MatchModel
      );
      chaiHttpResponse = await chai.request(app)
        .post('/matches')
        .send(mocks.mockMatchesInProgress)
        .set('Authorization', 'token-valid');

      expect(chaiHttpResponse.status).to.be.equal(201);
      expect(chaiHttpResponse.body).to.be.deep.equal(
        mocks.mockMatchesInProgress
      );
    });

    it('It should return the code 201 and the Match created', async () => {
      sinon.stub(jwtConfig, 'verify').returns({
        email: 'admin@admin.com',
        password: 'senha_admin'
      });

      chaiHttpResponse = await chai.request(app)
        .post('/matches')
        .send(mocks.wrongMockMatches)
        .set('Authorization', 'token-valid');

      expect(chaiHttpResponse.status).to.be.equal(422);
      expect(chaiHttpResponse.body).to.be.deep.equal({
        message: 'It is not possible to create a match with two equal teams'
      });
    });

    it('It should return the code 201 and the Match created', async () => {
      sinon.stub(jwtConfig, 'verify').returns({
        email: 'admin@admin.com',
        password: 'senha_admin'
      });

      chaiHttpResponse = await chai.request(app)
        .post('/matches')
        .send(mocks.notExistMockMatches)
        .set('Authorization', 'token-valid');

      expect(chaiHttpResponse.status).to.be.equal(404);
      expect(chaiHttpResponse.body).to.be.deep.equal({
        message: 'There is no team with such id!'
      });
    });
  });

  describe('PATCH /matches/:id/finish', () => {

    let chaiHttpResponse: Response;

    it('It should return the code 201 and the Match created', async () => {
      sinon.stub(jwtConfig, 'verify').returns({
        email: 'admin@admin.com',
        password: 'senha_admin'
      });

      chaiHttpResponse = await chai.request(app)
        .patch('/matches/1/finish')
        .set('Authorization', 'token-valid');

      expect(chaiHttpResponse.status).to.be.equal(200);
    });
  });

  describe('PATCH /matches/:id', () => {

    let chaiHttpResponse: Response;

    it('It should return the code 201 and the Match created', async () => {
      sinon.stub(jwtConfig, 'verify').returns({
        email: 'admin@admin.com',
        password: 'senha_admin'
      });

      chaiHttpResponse = await chai.request(app)
        .patch('/matches/1')
        .send({ homeTimeGoals: 10, awayTeamGoals: 2 })
        .set('Authorization', 'token-valid');

      expect(chaiHttpResponse.status).to.be.equal(200);
    });
  });
});