import { Router } from 'express';
import TeamController from '../controllers/TeamController';

const teamRouter = Router();

teamRouter.get('/', (req, res) => TeamController.getAll(req, res));

teamRouter.get('/:id', (req, res) => TeamController.getById(req, res));

export default teamRouter;
