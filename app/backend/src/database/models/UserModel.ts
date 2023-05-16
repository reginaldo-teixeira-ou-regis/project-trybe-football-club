import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

export interface UserAtributes {
  id: number,
  username: string,
  role: string,
  email: string,
  password: string
}

class User extends Model<UserAtributes> {
  declare id: number;
  declare username: string;
  declare role: string;
  declare email: string;
  declare password: string;
}

User.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  username: {
    type: STRING(30),
  },
  role: {
    type: STRING(30),
  },
  email: {
    type: STRING(50),
  },
  password: {
    type: STRING(30),
  },
}, {
  sequelize: db,
  modelName: 'users',
  timestamps: false,
  underscored: true,
});

export default User;
