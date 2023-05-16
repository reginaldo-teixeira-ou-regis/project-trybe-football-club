import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamController {
  public static async getAll(req: Request, res: Response) {
    const teams = await TeamService.getAll();
    return res.status(200).json(teams);
  }

  public static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const teams = await TeamService.getById(Number(id));
    if (typeof teams === 'string') return res.status(404).json({ message: teams });
    return res.status(200).json(teams);
  }
}
