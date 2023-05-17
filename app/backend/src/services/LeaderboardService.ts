import { MatchAtributes } from '../database/models/MatchModel';
import LeaderBoardInterface from '../interfaces/LeaderboardInterface';
import MatchService from './MatchService';
import TeamService from './TeamService';

export default class LeaderboardService {
  public static async getAll(value: string) {
    const allTeams = await TeamService.getAll();

    return Promise.all(allTeams.map(async (team) => {
      const matches = value === 'home' ? await MatchService
        .getHomeTimeById(team.id) : await MatchService.getAwayTimeById(team.id);
      return {
        name: team.teamName,
        totalPoints: value === 'home' ? this.getTotalHomePoints(matches)
          : this.getTotalAwayPoints(matches),
        totalGames: matches.length,
        totalVictories: this.getTotalVictories(matches, value),
        totalDraws: this.getTotalDraws(matches, value),
        totalLosses: this.getTotalLosses(matches, value),
        goalsFavor: this.getGoalsFavor(matches, value),
        goalsOwn: this.getGoalsOwn(matches, value),
        goalsBalance: this.getGoalsBalance(matches, value),
        efficiency: this.getEfficiency(matches, value),
      };
    }));
  }

  public static async filterAndReduce(value: LeaderBoardInterface[]) {
    const Teams = await TeamService.getAll();
    const result = Teams.map((el) => {
      const teamArray = value.filter((t) => t.name === el.teamName);
      return { name: el.teamName,
        totalPoints: teamArray[0].totalPoints + teamArray[1].totalPoints,
        totalGames: teamArray[0].totalGames + teamArray[1].totalGames,
        totalVictories: teamArray[0].totalVictories + teamArray[1].totalVictories,
        totalDraws: teamArray[0].totalDraws + teamArray[1].totalDraws,
        totalLosses: teamArray[0].totalLosses + teamArray[1].totalLosses,
        goalsFavor: teamArray[0].goalsFavor + teamArray[1].goalsFavor,
        goalsOwn: teamArray[0].goalsOwn + teamArray[1].goalsOwn,
        goalsBalance: teamArray[0].goalsBalance + teamArray[1].goalsBalance,
        efficiency: (((teamArray[0].totalPoints + teamArray[1].totalPoints)
           / ((teamArray[0].totalGames + teamArray[1].totalGames) * 3)) * 100).toFixed(2),
      };
    });
    const sortedResult = await this.sort(result);
    return sortedResult;
  }

  public static getTotalHomePoints(matches: MatchAtributes[]) {
    const result = matches.reduce((acc, el) => {
      if (el.homeTeamGoals < el.awayTeamGoals) {
        return acc;
      }
      if (el.homeTeamGoals > el.awayTeamGoals) {
        const points = acc + 3;
        return points;
      }
      return acc + 1;
    }, 0);
    return result;
  }

  public static getTotalAwayPoints(matches: MatchAtributes[]) {
    const result = matches.reduce((acc, el) => {
      if (el.awayTeamGoals < el.homeTeamGoals) {
        return acc;
      }
      if (el.awayTeamGoals > el.homeTeamGoals) {
        const points = acc + 3;
        return points;
      }
      return acc + 1;
    }, 0);
    return result;
  }

  public static getTotalVictories(
    matches: MatchAtributes[],
    someTeam: string,
  ) {
    if (someTeam === 'home') {
      const result = matches.reduce((acc, el) => (
        el.homeTeamGoals > el.awayTeamGoals ? acc + 1 : acc), 0);
      return result;
    }
    const result = matches.reduce((acc, el) => (
      el.awayTeamGoals > el.homeTeamGoals ? acc + 1 : acc), 0);
    return result;
  }

  public static getTotalDraws(
    matches: MatchAtributes[],
    someTeam: string,
  ) {
    if (someTeam === 'home') {
      const result = matches.reduce((acc, el) => (
        el.homeTeamGoals === el.awayTeamGoals ? acc + 1 : acc + 0), 0);
      return result;
    }
    const result = matches.reduce((acc, el) => (
      el.awayTeamGoals === el.homeTeamGoals ? acc + 1 : acc + 0), 0);
    return result;
  }

  public static getTotalLosses(matches: MatchAtributes[], someTeam: string) {
    if (someTeam === 'home') {
      const result = matches.reduce((acc, el) => (
        el.homeTeamGoals < el.awayTeamGoals ? acc + 1 : acc + 0), 0);
      return result;
    }
    const result = matches.reduce((acc, el) => (
      el.awayTeamGoals < el.homeTeamGoals ? acc + 1 : acc + 0), 0);
    return result;
  }

  public static getGoalsFavor(matches: MatchAtributes[], someTeam: string) {
    if (someTeam === 'home') {
      const result = matches.reduce((acc, el) => acc + el.homeTeamGoals, 0);
      return result;
    }
    const result = matches.reduce((acc, el) => acc + el.awayTeamGoals, 0);
    return result;
  }

  public static getGoalsOwn(matches: MatchAtributes[], someTeam: string) {
    if (someTeam === 'home') {
      const result = matches.reduce((acc, el) => (acc + el.awayTeamGoals), 0);
      return result;
    }
    const result = matches.reduce((acc, el) => (acc + el.homeTeamGoals), 0);
    return result;
  }

  public static getGoalsBalance(matches: MatchAtributes[], someTeam: string) {
    if (someTeam === 'home') {
      const result = matches.reduce((acc, el) => acc + (
        el.homeTeamGoals - el.awayTeamGoals
      ), 0);
      return result;
    }
    const result = matches.reduce((acc, el) => acc + (
      el.awayTeamGoals - el.homeTeamGoals
    ), 0);
    return result;
  }

  public static getEfficiency(matches: MatchAtributes[], someTeam: string) {
    let totalPoints;
    if (someTeam === 'home') {
      totalPoints = this.getTotalHomePoints(matches);
    } else {
      totalPoints = this.getTotalAwayPoints(matches);
    }
    const totalGames = matches.length;
    const result = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
    return result;
  }

  public static async sort(someTeam: string | LeaderBoardInterface[]) {
    const m = typeof someTeam === 'string' ? await this.getAll(someTeam)
      : someTeam;
    m.sort((b, a) => {
      if (a.totalPoints === b.totalPoints) {
        if (a.totalVictories === b.totalVictories) {
          if (a.goalsBalance === b.goalsBalance) {
            return a.goalsFavor - b.goalsFavor;
          }
          return a.goalsBalance - b.goalsBalance;
        }
        return a.totalVictories - b.totalVictories;
      }
      return a.totalPoints - b.totalPoints;
    }); return m;
  }
}
