import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamController {
  public static async getAll(req: Request, res: Response) {
    const teams = await TeamService.getAll();
    return res.status(200).json(teams);
  }
}
