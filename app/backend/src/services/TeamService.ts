import TeamModel, { TeamAtributes } from '../database/models/TeamModel';

export default class TeamService {
  public static async getAll(): Promise<TeamAtributes[]> {
    const allTeams = await TeamModel.findAll();
    return allTeams;
  }
}
