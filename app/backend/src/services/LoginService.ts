import { compareSync } from 'bcryptjs';
import jwtConfig from '../utils/jwtConfig';
import UserModel from '../database/models/UserModel';

export default class LoginService {
  public static async login(email: string, password: string)
    : Promise<string | { message: string }> {
    const userExist = await UserModel.findOne({ where: { email } });
    if (!userExist) {
      return { message: 'Invalid email or password' };
    }

    const unlock = compareSync(password, userExist.password);
    if (!unlock) {
      return { message: 'Invalid email or password' };
    }
    return jwtConfig.sign({ email, password });
  }

  public static async loginRole(
    email: string,
  ): Promise<string | { message: string }> {
    const userExist = await UserModel.findOne({ where: { email } });
    if (userExist) {
      return userExist.role;
    }
    return { message: 'user not found' };
  }
}
