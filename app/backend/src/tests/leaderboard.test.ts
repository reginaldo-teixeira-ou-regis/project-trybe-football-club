import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import MatchModel from '../database/models/MatchModel';
import { Response } from 'superagent';
import mocks from '../utils/mocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('Leaderboard Router', () => {

  afterEach(() => { sinon.restore(); });

  describe('GET /Leaderboard/home', () => {

    let chaiHttpResponse: Response;

    it('It should return the code 201 and the Match created', async () => {
      sinon.stub(TeamModel, 'findAll')
        .resolves(mocks.teamMock as TeamModel[]);

      sinon.stub(MatchModel, 'findAll')
        .resolves(mocks.mockMatchesLeaderboard as MatchModel[]);

      chaiHttpResponse = await chai.request(app).get('/leaderboard/home')

      expect(chaiHttpResponse.status).to.be.equal(200);
    });
  })

  describe('GET /Leaderboard/away', () => {

    let chaiHttpResponse: Response;

    it('It should return the code 201 and the Match created', async () => {
      sinon.stub(TeamModel, 'findAll')
        .resolves(mocks.teamMock as TeamModel[]);

      sinon.stub(MatchModel, 'findAll')
        .resolves(mocks.mockMatchesLeaderboardAway as MatchModel[]);

      chaiHttpResponse = await chai.request(app).get('/leaderboard/away')

      expect(chaiHttpResponse.status).to.be.equal(200);
    });
  })
});
