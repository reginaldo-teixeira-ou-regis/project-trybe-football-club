import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchController {
  public static async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (typeof inProgress === 'string') {
      const matches = await MatchService.getAllInProgress(inProgress);
      return res.status(200).json(matches);
    }
    const matches = await MatchService.getAll();
    return res.status(200).json(matches);
  }

  public static async updateInProgress(req: Request, res: Response) {
    const { id } = req.params;
    const finished = await MatchService.updateInProgress(Number(id));
    return res.status(200).json(finished);
  }

  public static async updateGoals(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const finished = await MatchService.updateGoals(
      Number(id),
      { homeTeamGoals, awayTeamGoals },
    );
    return res.status(200).json(finished);
  }

  public static async create(req: Request, res: Response) {
    const newMatch = await MatchService.create(req.body);
    if (typeof newMatch === 'string') {
      return res.status(newMatch.includes('id') ? 404 : 422)
        .json({ message: newMatch });
    }
    return res.status(201).json(newMatch);
  }
}
