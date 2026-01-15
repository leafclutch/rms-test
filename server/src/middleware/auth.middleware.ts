import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError.ts';
import prisma from '../config/prisma.ts';
import { config } from '../config/env.ts';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    const currentUser = await prisma.profile.findUnique({
      where: { id: decoded.userId },
    });

    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token does no longer exist.', 401)
      );
    }

    (req as any).user = currentUser;
    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
};
