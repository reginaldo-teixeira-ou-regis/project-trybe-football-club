interface MatchReturnAtributes {
  id: number;
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

const mockMatches = {
  id: 1,
  homeTeamId: 16,
  homeTeamGoals: 1,
  awayTeamId: 8,
  awayTeamGoals: 1,
  inProgress: false,
  homeTeam: {
    teamName: 'São Paulo',
  },
  awayTeam: {
    teamName: 'Grêmio',
  },
} as MatchReturnAtributes;

const wrongMockMatches = {
  id: 1,
  homeTeamId: 1,
  homeTeamGoals: 1,
  awayTeamId: 1,
  awayTeamGoals: 1,
  inProgress: false,
  homeTeam: {
    teamName: 'São Paulo',
  },
  awayTeam: {
    teamName: 'Grêmio',
  },
} as MatchReturnAtributes;

const notExistMockMatches = {
  id: 1,
  homeTeamId: 1,
  homeTeamGoals: 1,
  awayTeamId: 99,
  awayTeamGoals: 4,
  inProgress: false,
  homeTeam: {
    teamName: 'São Paulo',
  },
  awayTeam: {
    teamName: 'Grêmio',
  },
} as MatchReturnAtributes;

const mockMatchesInProgress = {
  id: 1,
  homeTeamId: 16,
  homeTeamGoals: 1,
  awayTeamId: 8,
  awayTeamGoals: 1,
  inProgress: true,
  homeTeam: {
    teamName: 'São Paulo',
  },
  awayTeam: {
    teamName: 'Grêmio',
  },
} as MatchReturnAtributes;

const mockMatchesLeaderboard = [{
  id: 1,
  homeTeamId: 1,
  homeTeamGoals: 5,
  awayTeamId: 8,
  awayTeamGoals: 1,
  inProgress: false,
}];

const mockMatchesLeaderboardAway = [{
  id: 1,
  homeTeamId: 8,
  homeTeamGoals: 5,
  awayTeamId: 1,
  awayTeamGoals: 1,
  inProgress: false,
}];

const teamMock = [
  {
    id: 1,
    teamName: 'Avaí/Kindermann',
  },
];

export default {
  mockMatches,
  mockMatchesInProgress,
  wrongMockMatches,
  notExistMockMatches,
  teamMock,
  mockMatchesLeaderboard,
  mockMatchesLeaderboardAway,
};

export {
  MatchReturnAtributes,
};
