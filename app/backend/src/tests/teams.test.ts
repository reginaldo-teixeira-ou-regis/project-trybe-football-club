import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams Router', () => {

  afterEach(() => { sinon.restore(); });

  describe('GET /teams', () => {

    let chaiHttpResponse: Response;

    it('It should return code 200 and the teams', async () => {
      sinon.stub(TeamModel, 'findAll').resolves([
        {
          id: 1,
          teamName: "Avaí/Kindermann"
        },
      ] as TeamModel[])

      chaiHttpResponse = await chai.request(app).get('/teams');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal([
        {
          id: 1,
          teamName: "Avaí/Kindermann"
        },
      ]);
    });
  });

  describe('GET /teams:id', () => {

    let chaiHttpResponse: Response;

    it('Should return code 404 and an error message', async () => {
      sinon.stub(TeamModel, 'findOne').resolves(undefined)

      chaiHttpResponse = await chai.request(app).get('/teams/99');

      expect(chaiHttpResponse.status).to.be.equal(404);
      expect(chaiHttpResponse.body).to.be.deep.equal(
        {
          message: "Team not found!"
        },
      );
    });

    it('It should return the code 200 and the team', async () => {
      sinon.stub(TeamModel, 'findOne').resolves(
        {
          id: 1,
          teamName: "Avaí/Kindermann"
        } as TeamModel)

      chaiHttpResponse = await chai.request(app).get('/teams/1');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(
        {
          id: 1,
          teamName: "Avaí/Kindermann"
        },
      );
    });
  })
});