import * as jwt from 'jsonwebtoken';

type AppJwtPayload = {
  email: string,
  password: string
};

function sign(payload: AppJwtPayload): string {
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'SECRET');
  return token;
}

function verify(token: string): AppJwtPayload {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET');
  return decoded as AppJwtPayload;
}

export default {
  sign,
  verify,
};
