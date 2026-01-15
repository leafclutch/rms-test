import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  databaseUrl: process.env.DATABASE_URL
};
