import { MatchAttributes } from '../database/models/MatchModel';
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
    const result = Teams.map((teamMap) => {
      const teamArray = value.filter((teamFilter) => teamFilter.name === teamMap.teamName);
      return { name: teamMap.teamName,
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

  public static getTotalHomePoints(matches: MatchAttributes[]) {
    const totalHomePoints = matches.reduce((addPoints, goals) => {
      if (goals.homeTeamGoals < goals.awayTeamGoals) {
        return addPoints;
      }
      if (goals.homeTeamGoals > goals.awayTeamGoals) {
        const pointsAdded = addPoints + 3;
        return pointsAdded;
      }
      return addPoints + 1;
    }, 0);
    return totalHomePoints;
  }

  public static getTotalAwayPoints(matches: MatchAttributes[]) {
    const totalAwayPoints = matches.reduce((addPoints, goals) => {
      if (goals.awayTeamGoals < goals.homeTeamGoals) {
        return addPoints;
      }
      if (goals.awayTeamGoals > goals.homeTeamGoals) {
        const pointsAdded = addPoints + 3;
        return pointsAdded;
      }
      return addPoints + 1;
    }, 0);
    return totalAwayPoints;
  }

  public static getTotalVictories(
    matches: MatchAttributes[],
    someTeam: string,
  ) {
    if (someTeam === 'home') {
      const victoriesAdded = matches.reduce((addVictories, goals) => (
        goals.homeTeamGoals > goals.awayTeamGoals ? addVictories + 1 : addVictories), 0);
      return victoriesAdded;
    }
    const victoriesAdded = matches.reduce((addVictories, goals) => (
      goals.awayTeamGoals > goals.homeTeamGoals ? addVictories + 1 : addVictories), 0);
    return victoriesAdded;
  }

  public static getTotalDraws(
    matches: MatchAttributes[],
    someTeam: string,
  ) {
    if (someTeam === 'home') {
      const drawsAdded = matches.reduce((addDraws, goals) => (
        goals.homeTeamGoals === goals.awayTeamGoals ? addDraws + 1 : addDraws + 0), 0);
      return drawsAdded;
    }
    const drawsAdded = matches.reduce((addDraws, goals) => (
      goals.awayTeamGoals === goals.homeTeamGoals ? addDraws + 1 : addDraws + 0), 0);
    return drawsAdded;
  }

  public static getTotalLosses(matches: MatchAttributes[], someTeam: string) {
    if (someTeam === 'home') {
      const lossesAdded = matches.reduce((addLosses, goals) => (
        goals.homeTeamGoals < goals.awayTeamGoals ? addLosses + 1 : addLosses + 0), 0);
      return lossesAdded;
    }
    const lossesAdded = matches.reduce((addLosses, goals) => (
      goals.awayTeamGoals < goals.homeTeamGoals ? addLosses + 1 : addLosses + 0), 0);
    return lossesAdded;
  }

  public static getGoalsFavor(matches: MatchAttributes[], someTeam: string) {
    if (someTeam === 'home') {
      const goalsAdded = matches.reduce((addGoals, goals) => addGoals + goals.homeTeamGoals, 0);
      return goalsAdded;
    }
    const goalsAdded = matches.reduce((addGoals, goals) => addGoals + goals.awayTeamGoals, 0);
    return goalsAdded;
  }

  public static getGoalsOwn(matches: MatchAttributes[], someTeam: string) {
    if (someTeam === 'home') {
      const goalsAdded = matches.reduce((addGoals, goals) => (addGoals + goals.awayTeamGoals), 0);
      return goalsAdded;
    }
    const goalsAdded = matches.reduce((addGoals, goals) => (addGoals + goals.homeTeamGoals), 0);
    return goalsAdded;
  }

  public static getGoalsBalance(matches: MatchAttributes[], someTeam: string) {
    if (someTeam === 'home') {
      const goalsBalanceAdded = matches.reduce((addGoalsBalance, goals) => addGoalsBalance + (
        goals.homeTeamGoals - goals.awayTeamGoals
      ), 0);
      return goalsBalanceAdded;
    }
    const goalsBalanceAdded = matches.reduce((addGoalsBalance, goals) => addGoalsBalance + (
      goals.awayTeamGoals - goals.homeTeamGoals
    ), 0);
    return goalsBalanceAdded;
  }

  public static getEfficiency(matches: MatchAttributes[], someTeam: string) {
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
    const classificationOrderly = typeof someTeam === 'string'
      ? await this.getAll(someTeam) : someTeam;
    classificationOrderly.sort((b, a) => {
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
    }); return classificationOrderly;
  }
}
