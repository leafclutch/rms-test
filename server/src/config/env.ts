import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImVtYWlsIjoiQW1lZXRhYmQxN0BnbWFpbC5jb20iLCJpYXQiOjE3MzUwNjExODQsImV4cCI6MTczNTA2NDc4NH0.4rUWTuXVXFihTtdYaMDjFRkhtu7lQ1FLHM_TJHcFcgc',
  databaseUrl: process.env.DATABASE_URL
};
