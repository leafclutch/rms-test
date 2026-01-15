import jwt from 'jsonwebtoken';
import { config } from '../config/env.ts';

export const createAccessToken = (userId: string, email: string, role: string) => {
  return jwt.sign(
    { userId, email, role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
