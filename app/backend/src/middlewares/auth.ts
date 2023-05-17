import { NextFunction, Request, Response } from 'express';
import jwtConfig from '../utils/jwtConfig';

export type AuthenticatedRequest = Request & {
  auth: {
    email: string
  }
};

async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const decoded = jwtConfig.verify(token);
    (req as AuthenticatedRequest).auth = {
      email: decoded.email,
    };
    next();
  } catch (err) {
    return res.status(401)
      .json({ message: 'Token must be a valid token' });
  }
}

export default authMiddleware;
