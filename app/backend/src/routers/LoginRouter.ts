import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import validationLogin from '../middlewares/validationLogin';
import authMiddleware from '../middlewares/auth';

const loginRouter = Router();

loginRouter.post(
  '/',
  (req, res, next) => validationLogin(req, res, next),
  (req, res) => LoginController.login(req, res),
);

loginRouter.get(
  '/role',
  (req, res, next) => authMiddleware(req, res, next),
  (req, res) => LoginController.loginRole(req, res),
);

export default loginRouter;
