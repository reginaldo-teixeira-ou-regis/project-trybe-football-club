import Team from '../database/models/TeamModel';
import MatchModel, { MatchAtributes } from '../database/models/MatchModel';
import MatchCreateAtributes from '../interfaces/MatchCreateAtributes';
import TeamService from './TeamService';

export default class MatchService {
  public static async getAllInProgress(
    inProgress: string | undefined,
  ): Promise<MatchAtributes[]> {
    const allMatches = await MatchModel.findAll({
      where: { inProgress: inProgress === 'true' },
      include: [{
        model: Team,
        as: 'homeTeam',
        attributes: { exclude: ['id'] } }, {
        model: Team,
        as: 'awayTeam',
        attributes: { exclude: ['id'] } }] });
    return allMatches;
  }

  public static async getAll(): Promise<MatchAtributes[]> {
    const allMatches = await MatchModel.findAll({
      include: [{
        model: Team,
        as: 'homeTeam',
        attributes: { exclude: ['id'] } }, {
        model: Team,
        as: 'awayTeam',
        attributes: { exclude: ['id'] } }] });
    return allMatches;
  }

  public static async getHomeTimeById(
    id: number,
  ): Promise<MatchAtributes[]> {
    const allMatches = await MatchModel.findAll({
      where: { homeTeamId: id, inProgress: false },
      include: [{
        model: Team,
        as: 'homeTeam',
        attributes: { exclude: ['id'] } }, {
        model: Team,
        as: 'awayTeam',
        attributes: { exclude: ['id'] } }] });
    return allMatches;
  }

  public static async getAwayTimeById(
    id: number,
  ): Promise<MatchAtributes[]> {
    const allMatches = await MatchModel.findAll({
      where: { awayTeamId: id, inProgress: false },
      include: [{
        model: Team,
        as: 'homeTeam',
        attributes: { exclude: ['id'] } }, {
        model: Team,
        as: 'awayTeam',
        attributes: { exclude: ['id'] } }] });
    return allMatches;
  }

  public static async updateInProgress(
    id: number,
  ): Promise<{ message: string }> {
    const a = await MatchModel
      .update({ inProgress: false }, { where: { id } });
    console.log(a);
    return { message: 'Finished' };
  }

  public static async updateGoals(id: number, goals: {
    homeTeamGoals: number, awayTeamGoals: number
  }): Promise<{ message: string }> {
    await MatchModel.update(goals, { where: { id } });
    return { message: 'updated' };
  }

  public static async create(
    match: MatchCreateAtributes,
  ): Promise<MatchAtributes | string > {
    const validation = await this.validation(match);
    if (validation.message !== 'true') {
      return validation.message;
    }
    const newMatch = await MatchModel.create(
      { ...match, inProgress: true },
    );
    return newMatch;
  }

  public static async validation(
    match: MatchCreateAtributes,
  ): Promise<{ message: string }> {
    if (match.homeTeamId === match.awayTeamId) {
      return {
        message: 'It is not possible to create a match with two equal teams',
      };
    }
    const homeTeam = await TeamService.getById(match.homeTeamId);
    const awayTeam = await TeamService.getById(match.awayTeamId);
    if (typeof homeTeam === 'string' || typeof awayTeam === 'string') {
      return { message: 'There is no team with such id!' };
    }
    return { message: 'true' };
  }
}
