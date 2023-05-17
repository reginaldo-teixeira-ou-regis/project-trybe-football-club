import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardRouter = Router();

leaderboardRouter.get('/home', (req, res) => LeaderboardController
  .getAllHome(req, res));

leaderboardRouter.get('/away', (req, res) => LeaderboardController
  .getAllAway(req, res));

leaderboardRouter.get('/', (req, res) => LeaderboardController
  .getAll(req, res));

export default leaderboardRouter;
