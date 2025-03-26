import { NextApiRequest, NextApiResponse } from 'next';
import { readData } from './db';
import { sign, verify } from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

// Secret key for JWT (in a real app, this would be in an environment variable)
const SECRET_KEY = 'your_jwt_secret_key';

// JWT token expiration (in seconds)
const TOKEN_EXPIRATION = 60 * 60 * 24 * 7; // 1 week

// Cookie name
const COOKIE_NAME = 'portfolio_auth_token';

// Function to authenticate a user
export const authenticateUser = (username: string, password: string): boolean => {
  const data = readData();
  return (
    username === data.adminCredentials.username &&
    password === data.adminCredentials.password
  );
};

// Function to create a JWT token
export const createToken = (username: string): string => {
  return sign({ username }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
};

// Function to set the authentication cookie
export const setAuthCookie = (res: NextApiResponse, token: string): void => {
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: false, // Set to false for debugging
    secure: false, // Set to false for http in development
    maxAge: TOKEN_EXPIRATION,
    sameSite: 'lax', // Use lax instead of strict
    path: '/',
  });
  
  console.log("Setting cookie:", cookie); // Debug log
  res.setHeader('Set-Cookie', cookie);
};

// Function to clear the authentication cookie
export const clearAuthCookie = (res: NextApiResponse): void => {
  const cookie = serialize(COOKIE_NAME, '', {
    httpOnly: false,
    secure: false,
    maxAge: -1,
    sameSite: 'lax',
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
};

// Function to verify the JWT token
export const verifyToken = (token: string): boolean => {
  try {
    verify(token, SECRET_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

// Middleware to check if the user is authenticated
export const isAuthenticated = (req: NextApiRequest): boolean => {
  // For API routes
  const cookies = req.headers.cookie;
  if (cookies) {
    const parsedCookies = parse(cookies);
    const token = parsedCookies[COOKIE_NAME];
    if (token && verifyToken(token)) {
      return true;
    }
  }
  
  // For development only: allow all API access during development
  if (process.env.NODE_ENV === 'development') {
    console.log("Development mode: bypassing authentication");
    return true;
  }
  
  return false;
};