import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

export interface TeamAttributes {
  id: number,
  teamName: string,
}

class Team extends Model<TeamAttributes> {
  declare id: number;
  declare teamName: string;
}

Team.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  teamName: {
    allowNull: false,
    type: STRING(30),
  },
}, {
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
  underscored: true,
});

export default Team;
