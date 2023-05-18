import TeamModel, { TeamAttributes } from '../database/models/TeamModel';

export default class TeamService {
  public static async getAll(): Promise<TeamAttributes[]> {
    const allTeams = await TeamModel.findAll();
    return allTeams;
  }

  public static async getById(
    id: number,
  ): Promise<TeamAttributes | string> {
    const team = await TeamModel.findOne({ where: { id } });
    if (!team) {
      return 'Team not found!';
    }
    return team;
  }
}
