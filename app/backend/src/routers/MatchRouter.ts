import { Router } from 'express';
import MatchController from '../controllers/MatchController';
import authMiddleware from '../middlewares/auth';

const matchRouter = Router();

matchRouter.get('/', (req, res) => MatchController.getAll(req, res));

matchRouter.patch(
  '/:id/finish',
  (req, res, next) => authMiddleware(req, res, next),
  (req, res) => MatchController.updateInProgress(req, res),
);

matchRouter.patch(
  '/:id',
  (req, res, next) => authMiddleware(req, res, next),
  (req, res) => MatchController.updateGoals(req, res),
);

matchRouter.post(
  '/',
  (req, res, next) => authMiddleware(req, res, next),
  (req, res) => MatchController.create(req, res),
);

export default matchRouter;
